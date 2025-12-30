import { useState } from 'react';
import { Plus, Trash2, Save, DollarSign } from 'lucide-react';
import { LoadingSpinner, EmptyState, Button } from '../common';
import { FormInput } from '../forms';
import { useFieldPricing, useUpdateFieldPricing } from '../../api/hooks/useField';
import toast from 'react-hot-toast';
import type { DayOfWeek } from '../../types';

interface FieldPricingEditorProps {
    fieldId: number;
}

const dayOptions = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
];

interface PricingRule {
    id: string;
    name: string;
    dayOfWeek: DayOfWeek[];
    startTime: string;
    endTime: string;
    pricePerHour: string;
    priority: string;
    isActive: boolean;
}

const FieldPricingEditor: React.FC<FieldPricingEditorProps> = ({ fieldId }) => {
    const { data: existingRules, isLoading } = useFieldPricing(fieldId);
    const updateMutation = useUpdateFieldPricing();

    const [rules, setRules] = useState<PricingRule[]>([]);
    const [initialized, setInitialized] = useState(false);

    // Initialize from existing rules
    if (existingRules && !initialized) {
        setRules(existingRules.map(r => ({
            id: r.pricingRuleId.toString(),
            name: r.name,
            dayOfWeek: r.dayOfWeek || [],
            startTime: r.startTime,
            endTime: r.endTime,
            pricePerHour: r.pricePerHour.toString(),
            priority: r.priority.toString(),
            isActive: r.isActive,
        })));
        setInitialized(true);
    }

    const addRule = () => {
        setRules(prev => [...prev, {
            id: `new-${Date.now()}`,
            name: '',
            dayOfWeek: [],
            startTime: '06:00',
            endTime: '22:00',
            pricePerHour: '',
            priority: (prev.length + 1).toString(),
            isActive: true,
        }]);
    };

    const removeRule = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id));
    };

    const updateRule = (id: string, field: keyof PricingRule, value: unknown) => {
        setRules(prev => prev.map(r =>
            r.id === id ? { ...r, [field]: value } : r
        ));
    };

    const toggleDay = (ruleId: string, day: DayOfWeek) => {
        setRules(prev => prev.map(r => {
            if (r.id !== ruleId) return r;
            const days = r.dayOfWeek.includes(day)
                ? r.dayOfWeek.filter(d => d !== day)
                : [...r.dayOfWeek, day];
            return { ...r, dayOfWeek: days };
        }));
    };

    const handleSave = async () => {
        // Validate
        for (const rule of rules) {
            if (!rule.name.trim()) {
                toast.error('All rules must have a name');
                return;
            }
            if (!rule.pricePerHour || parseFloat(rule.pricePerHour) <= 0) {
                toast.error('All rules must have a valid price');
                return;
            }
        }

        try {
            await updateMutation.mutateAsync({
                fieldId,
                rules: rules.map(r => ({
                    name: r.name,
                    dayOfWeek: r.dayOfWeek.length > 0 ? r.dayOfWeek : undefined,
                    startTime: r.startTime,
                    endTime: r.endTime,
                    pricePerHour: parseFloat(r.pricePerHour),
                    priority: parseInt(r.priority),
                    isActive: r.isActive,
                })),
            });
            toast.success('Pricing updated successfully');
        } catch {
            toast.error('Failed to update pricing');
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading pricing rules..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Pricing Rules</h2>
                        <p className="text-sm text-gray-500">Set custom prices for different times</p>
                    </div>
                </div>
                <Button onClick={addRule} leftIcon={<Plus className="w-4 h-4" />}>
                    Add Rule
                </Button>
            </div>

            {rules.length === 0 ? (
                <EmptyState
                    title="No Pricing Rules"
                    description="Default pricing will be used. Add rules for custom time-based pricing."
                />
            ) : (
                <div className="space-y-4">
                    {rules.map((rule, index) => (
                        <div key={rule.id} className="bg-white border rounded-xl p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <span className="text-sm font-medium text-gray-500">Rule #{index + 1}</span>
                                <button
                                    onClick={() => removeRule(rule.id)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="Rule Name"
                                    value={rule.name}
                                    onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
                                    placeholder="e.g., Weekend Premium"
                                />

                                <FormInput
                                    label="Price per Hour"
                                    type="number"
                                    step="0.01"
                                    value={rule.pricePerHour}
                                    onChange={(e) => updateRule(rule.id, 'pricePerHour', e.target.value)}
                                    placeholder="0.00"
                                />

                                <FormInput
                                    label="Start Time"
                                    type="time"
                                    value={rule.startTime}
                                    onChange={(e) => updateRule(rule.id, 'startTime', e.target.value)}
                                />

                                <FormInput
                                    label="End Time"
                                    type="time"
                                    value={rule.endTime}
                                    onChange={(e) => updateRule(rule.id, 'endTime', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apply on Days (leave empty for all days)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {dayOptions.map(day => (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleDay(rule.id, day.value as DayOfWeek)}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors border ${rule.dayOfWeek.includes(day.value as DayOfWeek)
                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                                : 'bg-gray-50 text-gray-600 border-gray-200'
                                                }`}
                                        >
                                            {day.label.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rule.isActive}
                                        onChange={(e) => updateRule(rule.id, 'isActive', e.target.checked)}
                                        className="w-4 h-4 rounded text-emerald-600"
                                    />
                                    <span className="text-sm text-gray-600">Rule is active</span>
                                </label>

                                <FormInput
                                    label=""
                                    type="number"
                                    value={rule.priority}
                                    onChange={(e) => updateRule(rule.id, 'priority', e.target.value)}
                                    className="w-24"
                                    placeholder="Priority"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    isLoading={updateMutation.isPending}
                    leftIcon={<Save className="w-4 h-4" />}
                >
                    Save Pricing Rules
                </Button>
            </div>
        </div>
    );
};

export default FieldPricingEditor;
