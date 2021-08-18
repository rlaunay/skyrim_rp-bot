interface Event {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => void; // eslint-disable-line
}

export default Event;
