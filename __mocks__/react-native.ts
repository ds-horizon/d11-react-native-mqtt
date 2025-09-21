const NativeModules = {
  MqttModule: {
    installJSIModule: jest.fn((shouldReturnTrue = true) => {
      return shouldReturnTrue;
    }),
    createMqtt: jest.fn(),
  },
};

const Platform = {
  OS: 'ios', // Default to iOS for testing
};

const mockedMqttClass = jest.fn();

class NativeEventEmitter {
  constructor(name) {
    mockedMqttClass(name);
  }
}

export { NativeModules, NativeEventEmitter, mockedMqttClass, Platform };
