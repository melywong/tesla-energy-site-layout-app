import { SimpleGrid, Stack, Text, Paper } from '@mantine/core';
import { DeviceSelection, LayoutResult } from '../types';
import {
  calculateTotalCost,
  calculateTotalEnergy,
  getTransformerCount,
  formatCurrency,
  formatEnergy,
} from '../utils/calculations';

interface Props {
  selections: DeviceSelection[];
  layout: LayoutResult;
}

export default function SiteSummary({ selections, layout }: Props) {
  const totalCost = calculateTotalCost(selections);
  const totalEnergy = calculateTotalEnergy(selections);
  const transformerCount = getTransformerCount(selections);

  const items = [
    { label: 'Total Energy', value: formatEnergy(totalEnergy) },
    { label: 'Total Cost', value: formatCurrency(totalCost) },
    { label: 'Transformers', value: String(transformerCount) },
    { label: 'Land Size', value: `${layout.totalWidth} x ${layout.totalDepth} ft` },
  ];

  return (
    <Stack gap="xs" mb="md">
      <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>
        Site Summary
      </Text>
      <SimpleGrid cols={4} spacing="sm">
        {items.map((item) => (
          <Paper key={item.label} p="lg" radius="md" withBorder>
            <Text size="xs" c="dimmed" tt="uppercase" fw={500} style={{ letterSpacing: 0.5 }}>
              {item.label}
            </Text>
            <Text size="xl" fw={600} mt="sm">
              {item.value}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
