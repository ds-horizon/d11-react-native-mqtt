import {
  mockedMqttClass,
  NativeEventEmitter,
  Platform,
} from '../../__mocks__/react-native';
import { MqttModule } from '../Modules/mqttModule';
import { EventEmitter } from '../Mqtt/EventEmitter';

jest.mock('react-native', () => ({
  ...jest.requireActual('../../__mocks__/react-native'),
  Platform: {
    OS: 'ios', // Default to iOS for testing
  },
}));

describe('EventEmitter', () => {
  afterEach(() => {
    jest.resetAllMocks();
    EventEmitter.resetInstance();
  });

  it('should create a new EventEmitter instance on iOS', () => {
    (Platform as any).OS = 'ios';
    const instance = EventEmitter.getInstance();
    expect(instance).toBeInstanceOf(NativeEventEmitter);
    expect(mockedMqttClass).toHaveBeenCalledWith(MqttModule);
  });

  it('should create a new EventEmitter instance on Android', () => {
    (Platform as any).OS = 'android';
    const instance = EventEmitter.getInstance();
    expect(instance).toBeInstanceOf(NativeEventEmitter);
    expect(mockedMqttClass).toHaveBeenCalledWith(undefined);
  });

  it('should always return the same instance for multiple calls', () => {
    (Platform as any).OS = 'ios';
    const firstInstance = EventEmitter.getInstance();
    const secondInstance = EventEmitter.getInstance();
    expect(secondInstance).toBe(firstInstance);
  });
});
