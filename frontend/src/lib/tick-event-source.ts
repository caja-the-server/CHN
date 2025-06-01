class TickEventSource {
  private readonly listners: Record<symbol, () => Promise<void>> = {};

  public constructor(tickInterval: number = 1000) {
    setInterval(() => {
      this.tick();
    }, tickInterval);
  }

  private tick() {
    for (const listener of Object.values<() => Promise<void>>(this.listners)) {
      listener();
    }
  }

  public addEventListener(listener: () => Promise<void>): () => void {
    const key = Symbol();
    this.listners[key] = listener;
    return () => {
      delete this.listners[key];
    };
  }
}

export const tickEventSource = new TickEventSource();
