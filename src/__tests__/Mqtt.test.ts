// @ts-nocheck
import { EventEmitter } from '../Mqtt/EventEmitter';
import { createMqttClient } from '../Mqtt/Mqtt';
import { MqttClient } from '../Mqtt/MqttClient';
import { MQTT_EVENTS } from '../Mqtt/MqttClient.constants';

jest.mock('../Mqtt/EventEmitter.ts', () => {
  const remove = jest.fn();
  const mEventEmitter = {
    getInstance: jest.fn(),
    addListener: jest.fn((_, callback) => {
      setImmediate(() => {
        callback({ clientInit: true, clientId: 'test-client-id' });
      });
      return { remove };
    }),
    removeAllListeners: jest.fn(),
  };
  mEventEmitter.getInstance.mockReturnValue(mEventEmitter);
  return { EventEmitter: mEventEmitter };
});

jest.mock('react-native', () => ({
  NativeModules: {
    MqttModule: {
      createMqtt: jest.fn(),
    },
  },
}));

describe('createMqttClient', () => {
  const clientId = 'test-client-id';
  const host = 'test-host';
  const port = 1883;
  const options = {};
  const config = { clientId, host, port, options };

  it('should resolve with an MqttClient instance if client initialization is successful', async () => {
    const client = await createMqttClient(config);
    expect(EventEmitter.getInstance).toHaveBeenCalled();
    expect(EventEmitter.getInstance().addListener).toHaveBeenCalledWith(
      MQTT_EVENTS.CLIENT_INITIALIZE_EVENT,
      expect.any(Function)
    );
    expect(client).toBeInstanceOf(MqttClient);
  });

  it('should correctly instantiate MqttClient with provided config with auto-reconnect', async () => {
    const client = await createMqttClient({ ...config, autoReconnect: true });
    expect(EventEmitter.getInstance).toHaveBeenCalled();
    expect(EventEmitter.getInstance().addListener).toHaveBeenCalledWith(
      MQTT_EVENTS.CLIENT_INITIALIZE_EVENT,
      expect.any(Function)
    );
    expect(client).toBeInstanceOf(MqttClient);
  });

  it('should resolve with undefined if client initialization fails', async () => {
    EventEmitter.getInstance().addListener = jest.fn((_, callback) => {
      setImmediate(() => {
        callback({ clientInit: false, clientId });
      });
      return { remove: jest.fn() };
    });
    const client = await createMqttClient(config);
    expect(EventEmitter.getInstance).toHaveBeenCalled();
    expect(EventEmitter.getInstance().addListener).toHaveBeenCalledWith(
      MQTT_EVENTS.CLIENT_INITIALIZE_EVENT,
      expect.any(Function)
    );
    expect(client).toBeUndefined();
  });

  it('should resolve with undefined if client host is not provided', async () => {
    const client = await createMqttClient({ clientId, port, options });
    expect(EventEmitter.getInstance).toHaveBeenCalled();
    expect(EventEmitter.getInstance().addListener).toHaveBeenCalledWith(
      MQTT_EVENTS.CLIENT_INITIALIZE_EVENT,
      expect.any(Function)
    );
    expect(client).toBeUndefined();
  });
});
