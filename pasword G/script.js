/**
 * ==========================================================================
 * Sicherer Passwort-Generator - Client-Side JavaScript Modul
 * Fachinformatiker Portfolio Project
 * ==========================================================================
 */

'use strict';

// --------------------------------------------------------------------------
// 1. Character Set Constants & Configuration
// --------------------------------------------------------------------------
const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const SIMILAR_CHARS = /[0O1lI|]/g;

// --------------------------------------------------------------------------
// 2. DOM Elements Cache
// --------------------------------------------------------------------------
const elements = {
  passwordOutput: document.getElementById('passwordOutput'),
  toggleVisibilityBtn: document.getElementById('toggleVisibilityBtn'),
  regenerateBtn: document.getElementById('regenerateBtn'),
  copyBtn: document.getElementById('copyBtn'),
  copyBtnText: document.getElementById('copyBtnText'),

  // Strength UI
  strengthBadge: document.getElementById('strengthBadge'),
  strengthMeter: document.getElementById('strengthMeter'),
  entropyValue: document.getElementById('entropyValue'),
  crackTimeValue: document.getElementById('crackTimeValue'),

  // Settings
  lengthSlider: document.getElementById('lengthSlider'),
  lengthInput: document.getElementById('lengthInput'),
  includeUppercase: document.getElementById('includeUppercase'),
  includeLowercase: document.getElementById('includeLowercase'),
  includeNumbers: document.getElementById('includeNumbers'),
  includeSymbols: document.getElementById('includeSymbols'),
  excludeSimilar: document.getElementById('excludeSimilar'),
  selectionWarning: document.getElementById('selectionWarning'),

  // Presets
  presetBtns: document.querySelectorAll('.preset-btn'),

  // Toast
  toast: document.getElementById('toastNotification'),
  toastMessage: document.getElementById('toastMessage')
};

// --------------------------------------------------------------------------
// 3. Cryptographically Secure Pseudo-Random Number Generator (CSPRNG)
// --------------------------------------------------------------------------

/**
 * Generates an unbiased random integer in the range [0, max - 1]
 * using window.crypto.getRandomValues with rejection sampling.
 * @param {number} max - Upper bound (exclusive)
 * @returns {number} Random integer
 */
function getSecureRandomInt(max) {
  if (max <= 0) return 0;
  
  const array = new Uint32Array(1);
  const maxUint32 = 4294967296; // 2^32
  const limit = maxUint32 - (maxUint32 % max);

  let randomVal;
  do {
    window.crypto.getRandomValues(array);
    randomVal = array[0];
  } while (randomVal >= limit);

  return randomVal % max;
}

/**
 * Shuffles an array in-place using Fisher-Yates with Web Crypto CSPRNG.
 * @param {Array} array 
 */
function fisherYatesShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// --------------------------------------------------------------------------
// 4. Password Generator Core Engine
// --------------------------------------------------------------------------

/**
 * Core function to generate password based on selected UI options.
 */
function generatePassword() {
  const length = parseInt(elements.lengthSlider.value, 10);
  const useUpper = elements.includeUppercase.checked;
  const useLower = elements.includeLowercase.checked;
  const useNumbers = elements.includeNumbers.checked;
  const useSymbols = elements.includeSymbols.checked;
  const filterSimilar = elements.excludeSimilar.checked;

  // Build active pools
  const selectedPools = [];

  if (useUpper) {
    let pool = CHAR_SETS.uppercase;
    if (filterSimilar) pool = pool.replace(SIMILAR_CHARS, '');
    selectedPools.push(pool);
  }
  if (useLower) {
    let pool = CHAR_SETS.lowercase;
    if (filterSimilar) pool = pool.replace(SIMILAR_CHARS, '');
    selectedPools.push(pool);
  }
  if (useNumbers) {
    let pool = CHAR_SETS.numbers;
    if (filterSimilar) pool = pool.replace(SIMILAR_CHARS, '');
    selectedPools.push(pool);
  }
  if (useSymbols) {
    let pool = CHAR_SETS.symbols;
    if (filterSimilar) pool = pool.replace(SIMILAR_CHARS, '');
    selectedPools.push(pool);
  }

  // Guard against zero selections
  if (selectedPools.length === 0) {
    elements.passwordOutput.value = '';
    updateStrengthMeter(0, 0, 0);
    return;
  }

  const combinedPool = selectedPools.join('');
  if (combinedPool.length === 0) {
    elements.passwordOutput.value = '';
    return;
  }

  const passwordChars = [];

  // Guarantee at least one character from each enabled type
  selectedPools.forEach(pool => {
    const randomIdx = getSecureRandomInt(pool.length);
    passwordChars.push(pool[randomIdx]);
  });

  // Fill remaining length from combined pool
  const remainingCount = length - passwordChars.length;
  for (let i = 0; i < remainingCount; i++) {
    const randomIdx = getSecureRandomInt(combinedPool.length);
    passwordChars.push(combinedPool[randomIdx]);
  }

  // Cryptographically shuffle characters
  fisherYatesShuffle(passwordChars);

  const finalPassword = passwordChars.join('');
  elements.passwordOutput.value = finalPassword;

  // Compute security metrics & update UI
  calculateAndDisplayMetrics(finalPassword, combinedPool.length, selectedPools.length);
}

// --------------------------------------------------------------------------
// 5. Strength, Shannon Entropy & Crack Time Calculations
// --------------------------------------------------------------------------

/**
 * Calculates Shannon entropy and estimates offline brute-force crack time.
 * @param {string} password 
 * @param {number} poolSize 
 * @param {number} typeCount 
 */
function calculateAndDisplayMetrics(password, poolSize, typeCount) {
  const length = password.length;

  if (length === 0 || poolSize === 0) {
    updateStrengthMeter(0, 0, 0);
    return;
  }

  // Shannon Entropy Formula: E = length * log2(poolSize)
  const entropy = length * (Math.log2(poolSize));

  // Determine strength level & score (1-4)
  let score = 1;
  let label = 'Schwach';
  let badgeClass = 'level-weak';

  if (entropy >= 85 && length >= 14 && typeCount >= 3) {
    score = 4;
    label = 'Sehr stark';
    badgeClass = 'level-very-strong';
  } else if (entropy >= 60 && length >= 12 && typeCount >= 2) {
    score = 3;
    label = 'Stark';
    badgeClass = 'level-strong';
  } else if (entropy >= 40 && length >= 9) {
    score = 2;
    label = 'Mittel';
    badgeClass = 'level-medium';
  } else {
    score = 1;
    label = 'Schwach';
    badgeClass = 'level-weak';
  }

  // Update visual meter bar & badge
  elements.strengthMeter.setAttribute('data-score', score);
  elements.strengthBadge.textContent = label;
  elements.strengthBadge.className = `strength-badge ${badgeClass}`;

  // Display Entropy
  elements.entropyValue.textContent = `${entropy.toFixed(1)} Bit`;

  // Estimate Brute-Force Crack Time
  // Assumption: Modern offline GPU cluster at 10^10 (10 Billion) hashes/sec
  const hashesPerSecond = 1e10;
  const totalCombinations = Math.pow(poolSize, length);
  const avgSecondsToCrack = (totalCombinations / 2) / hashesPerSecond;

  elements.crackTimeValue.textContent = formatCrackTime(avgSecondsToCrack);
}

/**
 * Formats seconds into human-readable German time spans.
 * @param {number} seconds 
 * @returns {string} Formatted German time string
 */
function formatCrackTime(seconds) {
  if (seconds < 1) return '< 1 Sekunde';
  if (seconds < 60) return `~ ${Math.round(seconds)} Sekunden`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `~ ${Math.round(minutes)} Minuten`;

  const hours = minutes / 60;
  if (hours < 24) return `~ ${Math.round(hours)} Stunden`;

  const days = hours / 24;
  if (days < 365) return `~ ${Math.round(days)} Tage`;

  const years = days / 365.25;
  if (years < 1000) return `~ ${Math.round(years)} Jahre`;
  if (years < 1e6) return `~ ${(years / 1000).toFixed(1)} Tsd. Jahre`;
  if (years < 1e9) return `~ ${(years / 1e6).toFixed(1)} Mio. Jahre`;
  if (years < 1e12) return `~ ${(years / 1e9).toFixed(1)} Mrd. Jahre`;

  return '> 1 Billion Jahre';
}

/**
 * Reset strength UI when no password is generated.
 */
function updateStrengthMeter(score, entropy, crackTime) {
  elements.strengthMeter.setAttribute('data-score', score);
  elements.strengthBadge.textContent = 'Keine';
  elements.strengthBadge.className = 'strength-badge level-weak';
  elements.entropyValue.textContent = '0 Bit';
  elements.crackTimeValue.textContent = 'Sofort';
}

// --------------------------------------------------------------------------
// 6. User Interaction Handlers (Copy, Visibility, Inputs)
// --------------------------------------------------------------------------

/**
 * Copies password to user clipboard with visual feedback.
 */
async function copyPasswordToClipboard() {
  const password = elements.passwordOutput.value;
  if (!password) return;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(password);
    } else {
      // Fallback for non-HTTPS or legacy environments
      elements.passwordOutput.select();
      document.execCommand('copy');
    }

    showCopyFeedback();
  } catch (err) {
    console.error('Fehler beim Kopieren:', err);
    // Fallback attempt
    elements.passwordOutput.select();
    document.execCommand('copy');
    showCopyFeedback();
  }
}

/**
 * UI feedback animation after copying password.
 */
function showCopyFeedback() {
  const copyIcon = elements.copyBtn.querySelector('.copy-icon');
  const checkIcon = elements.copyBtn.querySelector('.check-icon');

  // Change button appearance
  elements.copyBtn.classList.add('copied');
  elements.copyBtnText.textContent = 'Kopiert!';
  if (copyIcon) copyIcon.classList.add('hidden');
  if (checkIcon) checkIcon.classList.remove('hidden');

  // Show Toast
  showToast('Passwort in die Zwischenablage kopiert!');

  // Revert button state after 2 seconds
  setTimeout(() => {
    elements.copyBtn.classList.remove('copied');
    elements.copyBtnText.textContent = 'Passwort kopieren';
    if (copyIcon) copyIcon.classList.remove('hidden');
    if (checkIcon) checkIcon.classList.add('hidden');
  }, 2000);
}

/**
 * Shows transient toast notification.
 * @param {string} msg 
 */
function showToast(msg) {
  elements.toastMessage.textContent = msg;
  elements.toast.classList.remove('hidden');

  setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, 2500);
}

/**
 * Toggles plaintext password visibility.
 */
function togglePasswordVisibility() {
  const isPassword = elements.passwordOutput.type === 'password';
  elements.passwordOutput.type = isPassword ? 'text' : 'password';

  const eyeIcon = elements.toggleVisibilityBtn.querySelector('.eye-icon');
  const eyeOffIcon = elements.toggleVisibilityBtn.querySelector('.eye-off-icon');

  if (isPassword) {
    eyeIcon.classList.add('hidden');
    eyeOffIcon.classList.remove('hidden');
  } else {
    eyeIcon.classList.remove('hidden');
    eyeOffIcon.classList.add('hidden');
  }
}

/**
 * Synchronizes length slider with numerical input box.
 * @param {number} val 
 */
function updateLength(val) {
  const clampedVal = Math.min(32, Math.max(6, parseInt(val, 10) || 6));
  elements.lengthSlider.value = clampedVal;
  elements.lengthInput.value = clampedVal;

  // Update preset button active highlights
  updatePresetButtonsState(clampedVal);

  generatePassword();
}

/**
 * Enforces at least 1 checkbox selection.
 * @param {Event} e 
 */
function validateCheckboxSelection(e) {
  const checkboxes = [
    elements.includeUppercase,
    elements.includeLowercase,
    elements.includeNumbers,
    elements.includeSymbols
  ];

  const checkedCount = checkboxes.filter(cb => cb.checked).length;

  if (checkedCount === 0) {
    // Re-check target checkbox
    if (e && e.target) {
      e.target.checked = true;
    }
    elements.selectionWarning.classList.remove('hidden');
  } else {
    elements.selectionWarning.classList.add('hidden');
  }

  const currentLength = parseInt(elements.lengthSlider.value, 10);
  updatePresetButtonsState(currentLength);
  generatePassword();
}

/**
 * Handles Preset selection button clicks.
 * @param {string} presetType 
 */
function applyPreset(presetType) {
  elements.presetBtns.forEach(btn => btn.classList.remove('active'));

  switch (presetType) {
    case 'pin':
      elements.lengthSlider.value = 6;
      elements.lengthInput.value = 6;
      elements.includeUppercase.checked = false;
      elements.includeLowercase.checked = false;
      elements.includeNumbers.checked = true;
      elements.includeSymbols.checked = false;
      elements.excludeSimilar.checked = false;
      break;

    case 'standard':
      elements.lengthSlider.value = 16;
      elements.lengthInput.value = 16;
      elements.includeUppercase.checked = true;
      elements.includeLowercase.checked = true;
      elements.includeNumbers.checked = true;
      elements.includeSymbols.checked = true;
      elements.excludeSimilar.checked = false;
      break;

    case 'strong':
      elements.lengthSlider.value = 24;
      elements.lengthInput.value = 24;
      elements.includeUppercase.checked = true;
      elements.includeLowercase.checked = true;
      elements.includeNumbers.checked = true;
      elements.includeSymbols.checked = true;
      elements.excludeSimilar.checked = true;
      break;

    case 'maximum':
      elements.lengthSlider.value = 32;
      elements.lengthInput.value = 32;
      elements.includeUppercase.checked = true;
      elements.includeLowercase.checked = true;
      elements.includeNumbers.checked = true;
      elements.includeSymbols.checked = true;
      elements.excludeSimilar.checked = false;
      break;
  }

  const activeBtn = document.querySelector(`.preset-btn[data-preset="${presetType}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  elements.selectionWarning.classList.add('hidden');
  generatePassword();
}

/**
 * Updates preset button active states depending on current length and character options.
 * @param {number} currentLength 
 */
function updatePresetButtonsState(currentLength) {
  const useUpper = elements.includeUppercase.checked;
  const useLower = elements.includeLowercase.checked;
  const useNumbers = elements.includeNumbers.checked;
  const useSymbols = elements.includeSymbols.checked;
  const filterSimilar = elements.excludeSimilar.checked;

  elements.presetBtns.forEach(btn => {
    const preset = btn.dataset.preset;
    let isActive = false;

    if (preset === 'pin') {
      isActive = (currentLength === 6 && !useUpper && !useLower && useNumbers && !useSymbols && !filterSimilar);
    } else if (preset === 'standard') {
      isActive = (currentLength === 16 && useUpper && useLower && useNumbers && useSymbols && !filterSimilar);
    } else if (preset === 'strong') {
      isActive = (currentLength === 24 && useUpper && useLower && useNumbers && useSymbols && filterSimilar);
    } else if (preset === 'maximum') {
      isActive = (currentLength === 32 && useUpper && useLower && useNumbers && useSymbols && !filterSimilar);
    }

    btn.classList.toggle('active', isActive);
  });
}

// --------------------------------------------------------------------------
// 7. Event Listeners Initialization
// --------------------------------------------------------------------------
function initEventListeners() {
  // Password Action Buttons
  elements.copyBtn.addEventListener('click', copyPasswordToClipboard);
  elements.toggleVisibilityBtn.addEventListener('click', togglePasswordVisibility);
  elements.regenerateBtn.addEventListener('click', generatePassword);

  // Length Input & Slider Sync
  elements.lengthSlider.addEventListener('input', (e) => updateLength(e.target.value));
  elements.lengthInput.addEventListener('input', (e) => updateLength(e.target.value));

  // Checkbox Options
  const checkboxes = [
    elements.includeUppercase,
    elements.includeLowercase,
    elements.includeNumbers,
    elements.includeSymbols
  ];

  checkboxes.forEach(cb => {
    cb.addEventListener('change', validateCheckboxSelection);
  });

  elements.excludeSimilar.addEventListener('change', () => {
    const currentLength = parseInt(elements.lengthSlider.value, 10);
    updatePresetButtonsState(currentLength);
    generatePassword();
  });

  // Presets
  elements.presetBtns.forEach(btn => {
    btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
  });

  // Keyboard shortcut: Pressing Space or Enter when output focused copies password
  elements.passwordOutput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      copyPasswordToClipboard();
    }
  });
}

// --------------------------------------------------------------------------
// 8. Application Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  // Generate initial secure password
  generatePassword();
});
