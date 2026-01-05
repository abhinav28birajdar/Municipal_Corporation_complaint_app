import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Circle, AlertCircle } from 'lucide-react-native';
import { useAccessibility } from './AccessibilityProvider';

interface Step {
  id: string | number;
  title: string;
  description?: string;
  isOptional?: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: number[];
  errorSteps?: number[];
  onStepPress?: (stepIndex: number) => void;
  style?: ViewStyle;
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  activeColor?: string;
  completedColor?: string;
  errorColor?: string;
  inactiveColor?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps = [],
  errorSteps = [],
  onStepPress,
  style,
  orientation = 'horizontal',
  showLabels = true,
  activeColor = '#3B82F6',
  completedColor = '#10B981',
  errorColor = '#EF4444',
  inactiveColor = '#D1D5DB',
}) => {
  const { announceForAccessibility, hapticFeedback } = useAccessibility();

  const getStepStatus = (index: number): 'completed' | 'current' | 'error' | 'upcoming' => {
    if (errorSteps.includes(index)) return 'error';
    if (completedSteps.includes(index)) return 'completed';
    if (index === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return completedColor;
      case 'current': return activeColor;
      case 'error': return errorColor;
      default: return inactiveColor;
    }
  };

  const handleStepPress = (index: number) => {
    if (onStepPress && (completedSteps.includes(index) || index === currentStep)) {
      hapticFeedback('light');
      onStepPress(index);
      announceForAccessibility(`Navigating to step ${index + 1}: ${steps[index].title}`);
    }
  };

  const renderStepIcon = (index: number, status: string) => {
    const color = '#FFFFFF';
    const size = 16;

    if (status === 'completed') {
      return <Check size={size} color={color} />;
    }
    if (status === 'error') {
      return <AlertCircle size={size} color={color} />;
    }
    return <Text style={styles.stepNumber}>{index + 1}</Text>;
  };

  const isHorizontal = orientation === 'horizontal';

  return (
    <View
      style={[
        styles.container,
        isHorizontal ? styles.horizontal : styles.vertical,
        style,
      ]}
      accessibilityRole="tablist"
      accessibilityLabel={`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]?.title}`}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === steps.length - 1;
        const isClickable = completedSteps.includes(index) || index === currentStep;

        return (
          <React.Fragment key={step.id}>
            <TouchableOpacity
              style={[
                styles.stepContainer,
                isHorizontal ? styles.stepHorizontal : styles.stepVertical,
              ]}
              onPress={() => handleStepPress(index)}
              disabled={!isClickable}
              accessible
              accessibilityRole="tab"
              accessibilityState={{
                selected: index === currentStep,
                disabled: !isClickable,
              }}
              accessibilityLabel={`Step ${index + 1}: ${step.title}${step.isOptional ? ' (Optional)' : ''}`}
              accessibilityHint={isClickable ? 'Double tap to navigate to this step' : undefined}
            >
              <View
                style={[
                  styles.stepCircle,
                  { backgroundColor: getStepColor(status) },
                  index === currentStep && styles.currentStepCircle,
                ]}
              >
                {renderStepIcon(index, status)}
              </View>
              
              {showLabels && (
                <View style={[
                  styles.labelContainer,
                  isHorizontal ? styles.labelHorizontal : styles.labelVertical,
                ]}>
                  <Text
                    style={[
                      styles.stepTitle,
                      status === 'current' && styles.currentStepTitle,
                      status === 'completed' && styles.completedStepTitle,
                      status === 'error' && styles.errorStepTitle,
                    ]}
                    numberOfLines={1}
                  >
                    {step.title}
                  </Text>
                  {step.isOptional && (
                    <Text style={styles.optionalLabel}>Optional</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>

            {!isLast && (
              <View
                style={[
                  styles.connector,
                  isHorizontal ? styles.connectorHorizontal : styles.connectorVertical,
                  {
                    backgroundColor:
                      completedSteps.includes(index) ? completedColor : inactiveColor,
                  },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

// Wizard Container Component
interface WizardProps {
  steps: Step[];
  currentStep: number;
  children: React.ReactNode;
  onStepChange?: (step: number) => void;
  showStepIndicator?: boolean;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Wizard: React.FC<WizardProps> = ({
  steps,
  currentStep,
  children,
  onStepChange,
  showStepIndicator = true,
  headerStyle,
  contentStyle,
}) => {
  const completedSteps = Array.from({ length: currentStep }, (_, i) => i);

  return (
    <View style={styles.wizardContainer}>
      {showStepIndicator && (
        <View style={[styles.wizardHeader, headerStyle]}>
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepPress={onStepChange}
          />
        </View>
      )}
      <View style={[styles.wizardContent, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

// Progress Steps Component
interface ProgressStepsProps {
  total: number;
  current: number;
  style?: ViewStyle;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  total,
  current,
  style,
}) => {
  return (
    <View
      style={[styles.progressStepsContainer, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current} of ${total}`}
      accessibilityValue={{ min: 0, max: total, now: current }}
    >
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.progressDot,
            i < current && styles.progressDotCompleted,
            i === current && styles.progressDotCurrent,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vertical: {
    flexDirection: 'column',
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepHorizontal: {
    flex: 1,
  },
  stepVertical: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentStepCircle: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  labelContainer: {
    marginTop: 8,
  },
  labelHorizontal: {
    alignItems: 'center',
  },
  labelVertical: {
    marginLeft: 12,
    marginTop: 0,
    flex: 1,
  },
  stepTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  currentStepTitle: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  completedStepTitle: {
    color: '#10B981',
  },
  errorStepTitle: {
    color: '#EF4444',
  },
  optionalLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  connector: {
    backgroundColor: '#D1D5DB',
  },
  connectorHorizontal: {
    height: 2,
    flex: 1,
    marginHorizontal: 8,
    marginTop: 16,
  },
  connectorVertical: {
    width: 2,
    height: 20,
    marginLeft: 15,
  },
  wizardContainer: {
    flex: 1,
  },
  wizardHeader: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  wizardContent: {
    flex: 1,
    padding: 16,
  },
  progressStepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  progressDotCompleted: {
    backgroundColor: '#10B981',
  },
  progressDotCurrent: {
    backgroundColor: '#3B82F6',
    width: 24,
  },
});

export default StepIndicator;
