/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  Copy, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  Check, 
  Lock,
  Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong';

export default function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength>('medium');

  const generatePassword = useCallback(() => {
    const charset = {
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let characters = '';
    if (includeLowercase) characters += charset.lowercase;
    if (includeUppercase) characters += charset.uppercase;
    if (includeNumbers) characters += charset.numbers;
    if (includeSymbols) characters += charset.symbols;

    if (characters === '') {
      setPassword('');
      return;
    }

    let generatedPassword = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generatedPassword += characters.charAt(array[i] % characters.length);
    }

    setPassword(generatedPassword);
    calculateStrength(generatedPassword);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 8) score++;
    if (pwd.length > 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) setStrength('weak');
    else if (score === 3) setStrength('medium');
    else if (score === 4) setStrength('strong');
    else setStrength('very-strong');
  };

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const strengthConfig = {
    'weak': { color: 'bg-red-500', text: 'Weak', icon: ShieldAlert, textColor: 'text-red-500' },
    'medium': { color: 'bg-yellow-500', text: 'Medium', icon: Shield, textColor: 'text-yellow-500' },
    'strong': { color: 'bg-emerald-500', text: 'Strong', icon: ShieldCheck, textColor: 'text-emerald-500' },
    'very-strong': { color: 'bg-blue-500', text: 'Very Strong', icon: ShieldCheck, textColor: 'text-blue-500' },
  };

  const StrengthIcon = strengthConfig[strength].icon;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center p-4 font-sans selection:bg-emerald-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative"
      >
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full" />

        <header className="flex items-center gap-3 mb-8 relative">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <Lock className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SecurePass</h1>
            <p className="text-zinc-500 text-sm">Generate uncrackable passwords</p>
          </div>
        </header>

        <main className="space-y-8 relative">
          {/* Password Display */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative flex items-center bg-zinc-950 border border-white/5 rounded-2xl p-4 min-h-[72px]">
              <div className="flex-1 font-mono text-xl break-all pr-4 tracking-wider text-emerald-50">
                {password || <span className="text-zinc-700 italic">Select options...</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generatePassword}
                  className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-zinc-400 hover:text-white"
                  title="Generate new"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!password}
                  className={`p-2.5 rounded-xl transition-all relative overflow-hidden ${
                    copied ? 'bg-emerald-500 text-white' : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Copy className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>

          {/* Strength Meter */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Strength</span>
              <div className={`flex items-center gap-1.5 text-sm font-semibold ${strengthConfig[strength].textColor}`}>
                <StrengthIcon className="w-4 h-4" />
                {strengthConfig[strength].text}
              </div>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden flex gap-1">
              {['weak', 'medium', 'strong', 'very-strong'].map((s, idx) => {
                const levels = { 'weak': 1, 'medium': 2, 'strong': 3, 'very-strong': 4 };
                const currentLevel = levels[strength];
                const isActive = idx < currentLevel;
                return (
                  <motion.div 
                    key={s}
                    initial={false}
                    animate={{ 
                      backgroundColor: isActive ? strengthConfig[strength].color.replace('bg-', '') : '#27272a',
                      opacity: isActive ? 1 : 0.3
                    }}
                    className={`flex-1 h-full rounded-full transition-colors duration-500 ${isActive ? strengthConfig[strength].color : 'bg-zinc-800'}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-1 text-zinc-400">
              <Settings2 className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-widest">Configuration</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between px-1">
                  <label className="text-sm text-zinc-300">Password Length</label>
                  <span className="text-sm font-mono text-emerald-500 font-bold">{length}</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="50"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Checkbox 
                  label="Uppercase" 
                  checked={includeUppercase} 
                  onChange={setIncludeUppercase} 
                />
                <Checkbox 
                  label="Lowercase" 
                  checked={includeLowercase} 
                  onChange={setIncludeLowercase} 
                />
                <Checkbox 
                  label="Numbers" 
                  checked={includeNumbers} 
                  onChange={setIncludeNumbers} 
                />
                <Checkbox 
                  label="Symbols" 
                  checked={includeSymbols} 
                  onChange={setIncludeSymbols} 
                />
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-zinc-600 uppercase tracking-[0.2em]">
            Cryptographically Secure Generation
          </p>
        </footer>
      </motion.div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
        checked 
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-50' 
          : 'bg-zinc-950 border-white/5 text-zinc-500 hover:border-white/10'
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
        checked ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700'
      }`}>
        {checked && <Check className="w-3.5 h-3.5 text-zinc-950 stroke-[3]" />}
      </div>
    </button>
  );
}
