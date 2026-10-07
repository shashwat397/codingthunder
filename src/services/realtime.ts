// Realtime Synchronization Service for Codingthunder
// Supports Server-Sent Events (SSE), Web BroadcastChannel, and localStorage cross-tab signals

export interface RealtimeEvent {
  type: 'course_added' | 'course_updated' | 'course_deleted' | 'ebook_added' | 'ebook_updated' | 'ebook_deleted' | 'ping' | 'connected';
  entity: 'course' | 'ebook' | 'system';
  action: 'create' | 'update' | 'delete' | 'connect';
  id?: string;
  item?: any;
  timestamp: string;
}

type RealtimeListener = (event: RealtimeEvent) => void;

class RealtimeService {
  private listeners: Set<RealtimeListener> = new Set();
  private eventSource: EventSource | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private reconnectTimeout: any = null;
  private isConnecting = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initBroadcastChannel();
      this.initStorageListener();
      this.connectSSE();
    }
  }

  private initBroadcastChannel() {
    try {
      if ('BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel('codingthunder_realtime_channel');
        this.broadcastChannel.onmessage = (e) => {
          if (e.data && e.data.entity) {
            this.notifyListeners(e.data);
          }
        };
      }
    } catch (err) {
      console.warn('BroadcastChannel not available:', err);
    }
  }

  private initStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'codingthunder_realtime_event' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          this.notifyListeners(parsed);
        } catch {
          // ignore
        }
      }
    });
  }

  private connectSSE() {
    if (this.isConnecting || (this.eventSource && this.eventSource.readyState === EventSource.OPEN)) {
      return;
    }

    this.isConnecting = true;

    try {
      if (this.eventSource) {
        this.eventSource.close();
      }

      this.eventSource = new EventSource('/api/realtime/events');

      this.eventSource.onopen = () => {
        this.isConnecting = false;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data: RealtimeEvent = JSON.parse(event.data);
          if (data && data.entity) {
            this.notifyListeners(data);
          }
        } catch (err) {
          // heartbeat or non-json message
        }
      };

      this.eventSource.onerror = () => {
        this.isConnecting = false;
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // Retry connection in 3 seconds
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connectSSE();
          }, 3000);
        }
      };
    } catch (err) {
      this.isConnecting = false;
    }
  }

  private notifyListeners(event: RealtimeEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in realtime listener callback:', err);
      }
    });
  }

  public subscribe(listener: RealtimeListener): () => void {
    this.listeners.add(listener);
    // Ensure SSE is active
    if (!this.eventSource || this.eventSource.readyState === EventSource.CLOSED) {
      this.connectSSE();
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  public broadcast(event: Omit<RealtimeEvent, 'timestamp'>) {
    const fullEvent: RealtimeEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // 1. Notify local in-memory listeners
    this.notifyListeners(fullEvent);

    // 2. Broadcast across tabs via BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(fullEvent);
      } catch (err) {
        console.warn('Error broadcasting message:', err);
      }
    }

    // 3. Fallback broadcast via localStorage for older browsers or if channel fails
    try {
      localStorage.setItem('codingthunder_realtime_event', JSON.stringify(fullEvent));
      localStorage.removeItem('codingthunder_realtime_event');
    } catch {
      // ignore
    }
  }
}

export const realtimeService = new RealtimeService();

export function subscribeToRealtimeEvents(listener: RealtimeListener): () => void {
  return realtimeService.subscribe(listener);
}

export function broadcastRealtimeAction(event: Omit<RealtimeEvent, 'timestamp'>) {
  realtimeService.broadcast(event);
}
