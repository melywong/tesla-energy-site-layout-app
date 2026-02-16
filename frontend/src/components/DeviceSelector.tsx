import { Stack, Text, Group, NumberInput, Card, Button } from '@mantine/core';
import { DeviceSelection } from '../types';
import { DEVICES } from '../data/devices';

interface Props {
  selections: DeviceSelection[];
  onChange: (selections: DeviceSelection[]) => void;
}

export default function DeviceSelector({ selections, onChange }: Props) {
  const getQuantity = (deviceId: string): number => {
    const sel = selections.find((s) => s.deviceId === deviceId);
    return sel ? sel.quantity : 0;
  };

  const handleChange = (deviceId: string, value: string | number) => {
    const quantity = Math.max(0, typeof value === 'number' ? value : parseInt(value) || 0);
    const existing = selections.filter((s) => s.deviceId !== deviceId);
    if (quantity > 0) {
      onChange([...existing, { deviceId, quantity }]);
    } else {
      onChange(existing);
    }
  };

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>
          Battery Selection
        </Text>
        {selections.length > 0 && (
          <Button size="compact-xs" variant="subtle" color="red" onClick={() => onChange([])}>
            Clear All
          </Button>
        )}
      </Group>
      {DEVICES.map((device) => (
        <Card key={device.id} padding="md" radius="md" withBorder>
          <Group justify="space-between" wrap="nowrap">
            <div>
              <Text size="md" fw={500}>
                {device.name}
              </Text>
              <Text size="sm" c="dimmed" mt={4}>
                {device.width}x{device.depth}ft &middot; {device.energy} MWh &middot; $
                {device.cost.toLocaleString()}
              </Text>
            </div>
            <NumberInput
              value={getQuantity(device.id)}
              onChange={(val) => handleChange(device.id, val)}
              min={0}
              max={100}
              step={1}
              w={110}
              size="md"
              aria-label={`${device.name} quantity`}
            />
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
