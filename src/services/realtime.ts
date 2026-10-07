export type RealtimeEntity = 'course' | 'tutorial' | 'ebook' | 'user' | 'order' | 'enrollment' | 'setting';
export type RealtimeAction = 'create' | 'update' | 'delete' | 'refresh';

export interface RealtimeEvent {
  entity: RealtimeEntity;
  action: RealtimeAction;
  id?: string;
  payload?: any;
  timestamp?: number;
}

type EventCallback = (event: RealtimeEvent) => void;

class RealtimeService {
  private listeners: Set<EventCallback> = new Set();
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('codingthunder_realtime_events');
        this.channel.onmessage = (messageEvent) => {
          if (messageEvent.data && typeof messageEvent.data === 'object') {
            this.notifyListeners(messageEvent.data as RealtimeEvent);
          }
        };
      } catch (e) {
        // Fallback gracefully if BroadcastChannel fails in restricted contexts
        console.warn('BroadcastChannel not available, using local event dispatcher');
      }
    }
  }

  private notifyListeners(event: RealtimeEvent) {
    this.listeners.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error('Error in realtime event listener:', err);
      }
    });
  }

  public subscribe(callback: EventCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public emit(event: RealtimeEvent) {
    const fullEvent: RealtimeEvent = {
      ...event,
      timestamp: Date.now(),
    };
    // Notify in-process listeners
    this.notifyListeners(fullEvent);

    // Broadcast to other tabs/windows
    if (this.channel) {
      try {
        this.channel.postMessage(fullEvent);
      } catch (e) {
        // Ignore channel post errors
      }
    }
  }
}

export const realtimeService = new RealtimeService();

export function subscribeToRealtimeEvents(callback: EventCallback): () => void {
  return realtimeService.subscribe(callback);
}

export function emitRealtimeEvent(event: RealtimeEvent): void {
  realtimeService.emit(event);
}
