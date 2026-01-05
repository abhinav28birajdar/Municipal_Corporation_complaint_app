import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import { colors } from '@/constants/Colors';

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  error?: string;
  disabled?: boolean;
  cellStyle?: object;
  focusedCellStyle?: object;
  filledCellStyle?: object;
  errorCellStyle?: object;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  autoFocus = true,
  secureTextEntry = false,
  error,
  disabled = false,
  cellStyle,
  focusedCellStyle,
  filledCellStyle,
  errorCellStyle,
}) => {
  const [otp, setOtp] = useState<string[]>(value.split('').slice(0, length));
  const [focusedIndex, setFocusedIndex] = useState<number>(autoFocus ? 0 : -1);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (value) {
      setOtp(value.split('').slice(0, length));
    }
  }, [value, length]);

  useEffect(() => {
    if (error) {
      triggerShake();
    }
  }, [error]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleChange = (text: string, index: number) => {
    if (disabled) return;

    const newOtp = [...otp];
    
    // Handle paste
    if (text.length > 1) {
      const pastedText = text.slice(0, length - index);
      for (let i = 0; i < pastedText.length; i++) {
        if (index + i < length) {
          newOtp[index + i] = pastedText[i];
        }
      }
      setOtp(newOtp);
      
      const nextIndex = Math.min(index + pastedText.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
      
      const otpValue = newOtp.join('');
      onChange?.(otpValue);
      if (otpValue.length === length) {
        onComplete?.(otpValue);
        Keyboard.dismiss();
      }
      return;
    }

    // Handle single character
    if (/^\d*$/.test(text)) {
      newOtp[index] = text;
      setOtp(newOtp);
      
      const otpValue = newOtp.join('');
      onChange?.(otpValue);

      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      }

      if (otpValue.length === length && !otpValue.includes('')) {
        onComplete?.(otpValue);
        Keyboard.dismiss();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      onChange?.(newOtp.join(''));
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const getCellStyle = (index: number) => {
    const baseStyle = [styles.cell, cellStyle];
    
    if (error) {
      baseStyle.push(styles.errorCell, errorCellStyle);
    } else if (focusedIndex === index) {
      baseStyle.push(styles.focusedCell, focusedCellStyle);
    } else if (otp[index]) {
      baseStyle.push(styles.filledCell, filledCellStyle);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledCell);
    }
    
    return baseStyle;
  };

  return (
    <View>
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateX: shakeAnimation }] },
        ]}
        accessible
        accessibilityRole="none"
        accessibilityLabel={`Enter ${length}-digit verification code`}
      >
        {Array.from({ length }, (_, index) => (
          <View key={index} style={getCellStyle(index)}>
            <TextInput
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.input}
              value={secureTextEntry && otp[index] ? '•' : otp[index] || ''}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              keyboardType="number-pad"
              maxLength={length - index}
              selectTextOnFocus
              editable={!disabled}
              accessible
              accessibilityLabel={`Digit ${index + 1} of ${length}`}
              accessibilityHint={otp[index] ? `Current value is ${secureTextEntry ? 'hidden' : otp[index]}` : 'Enter a digit'}
            />
          </View>
        ))}
      </Animated.View>
      {error && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
};

// Countdown Timer Component
interface CountdownTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
  onResend?: () => void;
  resendLabel?: string;
  countdownLabel?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onComplete,
  onResend,
  resendLabel = 'Resend code',
  countdownLabel = 'Resend code in',
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      onComplete?.();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, onComplete]);

  const handleResend = () => {
    setSeconds(initialSeconds);
    setIsActive(true);
    onResend?.();
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  if (seconds > 0) {
    return (
      <Text style={styles.countdownText}>
        {countdownLabel} <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      </Text>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleResend}
      accessible
      accessibilityRole="button"
      accessibilityLabel={resendLabel}
    >
      <Text style={styles.resendText}>{resendLabel}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  cell: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  focusedCell: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filledCell: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  errorCell: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  disabledCell: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  input: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F2937',
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  countdownText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
  timerText: {
    color: colors.primary,
    fontWeight: '600',
  },
  resendText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default OTPInput;
