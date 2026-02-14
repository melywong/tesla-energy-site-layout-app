import { useState, useEffect } from 'react';
import { Stack, Text, Group, Button, TextInput } from '@mantine/core';
import { DeviceSelection, Session } from '../types';
import {
  saveSession,
  listSessions,
  getSession,
  deleteSession,
  saveLocalSession,
  listLocalSessions,
  deleteLocalSession,
  encodeConfigToUrl,
  isBackendAvailable,
} from '../utils/api';

interface Props {
  selections: DeviceSelection[];
  onLoad: (selections: DeviceSelection[]) => void;
}

export default function SessionManager({ selections, onLoad }: Props) {
  const [sessionName, setSessionName] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [backendUp, setBackendUp] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    isBackendAvailable().then((up) => {
      setBackendUp(up);
      if (up) {
        refreshBackendSessions();
      } else {
        setSessions(listLocalSessions());
      }
    });
  }, []);

  const refreshBackendSessions = async () => {
    try {
      const list = await listSessions();
      setSessions(list);
    } catch {
      setSessions([]);
    }
  };

  const showStatus = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleSave = async () => {
    if (!sessionName.trim()) return;
    const config = { selections };
    try {
      if (backendUp) {
        await saveSession(sessionName, config);
        refreshBackendSessions();
      } else {
        saveLocalSession(sessionName, config);
        setSessions(listLocalSessions());
      }
      setSessionName('');
      showStatus('Saved!');
    } catch {
      showStatus('Save failed');
    }
  };

  const handleLoad = async (session: Session) => {
    try {
      if (session.id && backendUp) {
        const full = await getSession(session.id);
        onLoad(full.config.selections);
      } else {
        onLoad(session.config.selections);
      }
      showStatus('Loaded!');
    } catch {
      showStatus('Load failed');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (backendUp) {
        await deleteSession(id);
        refreshBackendSessions();
      } else {
        deleteLocalSession(id);
        setSessions(listLocalSessions());
      }
    } catch {
      showStatus('Delete failed');
    }
  };

  const handleCopyLink = () => {
    if (selections.length === 0) {
      showStatus('Add batteries first');
      return;
    }
    const url = encodeConfigToUrl(selections);
    navigator.clipboard.writeText(url).then(
      () => showStatus('Link copied!'),
      () => {
        window.location.hash = new URL(url).hash;
        showStatus('Link updated in address bar');
      },
    );
  };

  return (
    <Stack gap="sm" mt="xl">
      <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>
        Sessions
      </Text>

      <Group gap="sm">
        <Button size="sm" variant="filled" onClick={handleCopyLink}>
          Copy Shareable Link
        </Button>
        <Text size="xs" c="dimmed">
          Bookmark or share to restore later
        </Text>
      </Group>

      <Group gap="xs" mt="xs">
        <TextInput
          placeholder="Session name"
          value={sessionName}
          onChange={(e) => setSessionName(e.currentTarget.value)}
          size="xs"
          style={{ flex: 1 }}
          aria-label="Session name"
        />
        <Button size="xs" variant="filled" onClick={handleSave}>
          Save
        </Button>
      </Group>

      {sessions.length > 0 && (
        <Stack gap={4}>
          {sessions.map((s) => (
            <Group key={s.id} justify="space-between" py={4}>
              <Text size="sm">{s.name}</Text>
              <Group gap={4}>
                <Button size="compact-xs" variant="light" onClick={() => handleLoad(s)}>
                  Load
                </Button>
                <Button
                  size="compact-xs"
                  variant="subtle"
                  color="red"
                  onClick={() => handleDelete(s.id!)}
                >
                  Delete
                </Button>
              </Group>
            </Group>
          ))}
        </Stack>
      )}

      {!backendUp && sessions.length === 0 && (
        <Text size="xs" c="dimmed" fs="italic">
          Sessions are saved in your browser's local storage.
        </Text>
      )}

      {status && (
        <Text size="xs" c="green">
          {status}
        </Text>
      )}
    </Stack>
  );
}
