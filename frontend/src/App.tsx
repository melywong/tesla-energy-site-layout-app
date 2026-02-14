import { useState, useEffect, useMemo } from 'react';
import { AppShell, Container, Grid, Group, Title, Text } from '@mantine/core';
import { DeviceSelection } from './types';
import { decodeConfigFromUrl } from './utils/api';
import { generateLayout } from './utils/layoutEngine';
import DeviceSelector from './components/DeviceSelector';
import SiteSummary from './components/SiteSummary';
import SiteLayout from './components/SiteLayout';
import SessionManager from './components/SessionManager';

export default function App() {
  const [selections, setSelections] = useState<DeviceSelection[]>([]);

  useEffect(() => {
    const loaded = decodeConfigFromUrl();
    if (loaded) setSelections(loaded);
  }, []);

  const layout = useMemo(() => generateLayout(selections), [selections]);

  return (
    <AppShell header={{ height: 56 }} padding="xl">
      <AppShell.Header>
        <Group h="100%" px="lg">
          <Group gap="xs">
            <Title order={4} c="red.8" fw={700}>
              TESLA
            </Title>
            <Text size="sm" fw={500} c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
              Energy Site Layout
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <DeviceSelector selections={selections} onChange={setSelections} />
              <SessionManager selections={selections} onLoad={setSelections} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <SiteSummary selections={selections} layout={layout} />
              <SiteLayout layout={layout} />
            </Grid.Col>
          </Grid>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
