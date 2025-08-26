export class EventQueue<T> {
  private queue: {
    payload: T;
    resolve: () => void;
    reject: (err: Error) => void;
  }[] = [];
  private processingFlag = false;
  private eventHandler: (payload: T) => Promise<void>;

  constructor(eventHandler: (payload: T) => Promise<void>) {
    this.eventHandler = eventHandler;
  }

  enqueue(payload: T): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push({ payload, resolve, reject });
      this.processNext();
    });
  }

  private async processNext() {
    if (this.processingFlag) return;
    const job = this.queue.shift();
    if (!job) return;

    this.processingFlag = true;
    try {
      await this.eventHandler(job.payload);
      job.resolve();
    } catch (err) {
      job.reject(err as Error);
    } finally {
      this.processingFlag = false;
      this.processNext();
    }
  }
}
