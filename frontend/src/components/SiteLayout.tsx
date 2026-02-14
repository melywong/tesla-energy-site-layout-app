import { Stack, Text, Paper, Group } from '@mantine/core';
import { LayoutResult } from '../types';

interface Props {
  layout: LayoutResult;
}

const DEVICE_COLORS: Record<string, string> = {
  'megapack-xl': '#cc0000',
  'megapack-2': '#393c41',
  megapack: '#5c5e62',
  powerpack: '#8c8c8c',
  transformer: '#b5a642',
};

const SHORT_NAMES: Record<string, string> = {
  'megapack-xl': 'MPXL',
  'megapack-2': 'MP2',
  megapack: 'MP',
  powerpack: 'PP',
  transformer: 'TX',
};

const MIN_SCALE = 7; // minimum pixels per foot

export default function SiteLayout({ layout }: Props) {
  if (layout.items.length === 0) {
    return (
      <Stack gap="xs">
        <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>
          Site Layout
        </Text>
        <Paper p="xl" py={80} radius="md" withBorder ta="center" bg="gray.0">
          <Text c="dimmed" fs="italic" size="lg">
            Add batteries to see the site layout.
          </Text>
        </Paper>
      </Stack>
    );
  }

  const svgHeight = layout.totalDepth * MIN_SCALE;

  // Only show legend entries for devices present in the current layout
  const activeDeviceIds = new Set(layout.items.map((item) => item.deviceId));

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="flex-end">
        <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>
          Site Layout
        </Text>
        <Text size="xs" c="dimmed">
          {layout.totalWidth}ft x {layout.totalDepth}ft (max width: 100ft)
        </Text>
      </Group>
      <Paper p="xl" radius="md" withBorder bg="gray.0">
        <svg
          width="100%"
          height={Math.max(svgHeight, 300)}
          viewBox={`0 0 ${layout.totalWidth} ${layout.totalDepth}`}
          preserveAspectRatio="xMinYMin meet"
          style={{ display: 'block' }}
        >
          {layout.items.map((item, i) => (
            <g key={i}>
              <rect
                x={item.x}
                y={item.y}
                width={item.width}
                height={item.depth}
                fill={DEVICE_COLORS[item.deviceId] || '#666'}
                stroke="#e0e0e0"
                strokeWidth={0.5}
                rx={0.5}
              />
              <text
                x={item.x + item.width / 2}
                y={item.y + item.depth / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize={item.width >= 30 ? 3.5 : 2.5}
                fontWeight="bold"
              >
                {item.width >= 30 ? item.name : SHORT_NAMES[item.deviceId] || item.name}
              </text>
            </g>
          ))}
        </svg>
      </Paper>
      <Paper p="md" radius="md" withBorder>
        <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb="xs" style={{ letterSpacing: 1 }}>
          Legend
        </Text>
        <Group gap="lg">
          {Object.entries(DEVICE_COLORS)
            .filter(([id]) => activeDeviceIds.has(id))
            .map(([id, color]) => (
              <Group key={id} gap="xs" wrap="nowrap">
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    backgroundColor: color,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <Text size="sm" fw={600} lh={1.2}>
                    {SHORT_NAMES[id]}
                  </Text>
                  <Text size="xs" c="dimmed" lh={1.2} style={{ textTransform: 'capitalize' }}>
                    {id.replace(/-/g, ' ')}
                  </Text>
                </div>
              </Group>
            ))}
        </Group>
      </Paper>
    </Stack>
  );
}
