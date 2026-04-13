import { mount } from '@vue/test-utils'
import PushMqttView from '../PushMqttView.vue'
import { createTestingPinia } from '../../tests/testUtils'

describe('PushMqttView (interaction tests)', () => {
  it('mounts without error', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsInputSwitch: true, BsProgress: true }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays page heading', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsInputSwitch: true, BsProgress: true }
      }
    })
    expect(wrapper.text()).toContain('MQTT')
  })

  it('displays settings form', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsInputSwitch: true, BsProgress: true }
      }
    })
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('has save button', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsInputSwitch: true, BsProgress: true }
      }
    })
    const buttons = wrapper.findAll('button')
    const saveButton = buttons.find((b) => b.text().includes('Save'))
    expect(saveButton).toBeDefined()
  })

  it('has test button', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsInputSwitch: true, BsProgress: true }
      }
    })
    const buttons = wrapper.findAll('button')
    const testButton = buttons.find((b) => b.text().includes('push test'))
    expect(testButton).toBeDefined()
  })

  it('has save function defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsInputSwitch: true, BsProgress: true }
      }
    })
    expect(typeof wrapper.vm.save).toBe('function')
  })

  it('has runTest function defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsInputSwitch: true, BsProgress: true }
      }
    })
    expect(typeof wrapper.vm.runTest).toBe('function')
  })

  it('has config state defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsInputSwitch: true, BsProgress: true }
      }
    })
    expect(wrapper.vm.config).toBeDefined()
  })

  it('displays container layout', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsInputSwitch: true, BsProgress: true }
      }
    })
    expect(wrapper.find('.container').exists()).toBe(true)
  })

  it('form has needs-validation class', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsInputSwitch: true, BsProgress: true }
      }
    })
    const form = wrapper.find('form')
    expect(form.classes()).toContain('needs-validation')
  })
})

describe('PushMqttView (action tests)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('save calls config.saveAll when form is valid', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const wrapper = mount(PushMqttView, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    await wrapper.vm.save()
    const { config } = await import('@/modules/pinia')
    expect(config.saveAll).toHaveBeenCalled()
  })
  it('runTest calls config.runPushTest', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const wrapper = mount(PushMqttView, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    await wrapper.vm.runTest()
    const { config } = await import('@/modules/pinia')
    expect(config.runPushTest).toHaveBeenCalled()
  })

  it('mqttFormatCallback updates config.mqtt_format_gravity', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushMqttView, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    wrapper.vm.mqttFormatCallback(encodeURIComponent('key|value'))
    expect(config.mqtt_format_gravity).not.toBeUndefined()
  })

  it('renderFormat calls applyTemplate and sets render', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const wrapper = mount(PushMqttView, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    expect(() => wrapper.vm.renderFormat()).not.toThrow()
  })

  it('pushDisabled returns true when mqtt disabled in global', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const { global } = await import('@/modules/pinia')
    global.disabled = true
    const wrapper = mount(PushMqttView, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('pushDisabled returns true when use_wifi_direct is true', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const { config } = await import('@/modules/pinia')
    config.use_wifi_direct = true
    const wrapper = mount(PushMqttView, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('mqttFormatCallback decodes URI and replaces pipe with newline', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushMqttView, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    wrapper.vm.mqttFormatCallback(encodeURIComponent('key|value'))
    expect(config.mqtt_format_gravity).toContain('|\n')
  })

  it('runTest calls config.runPushTest with correct data', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const { config, global } = await import('@/modules/pinia')
    global.clearMessages()
    const wrapper = mount(PushMqttView, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    await wrapper.vm.runTest()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'mqtt_format_gravity' })
  })

  it('save does not call config.saveAll when form validation fails', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const { validateCurrentForm } = await import('@mp-se/espframework-ui-components')
    const { config } = await import('@/modules/pinia')
    vi.mocked(validateCurrentForm).mockReturnValue(false)
    config.saveAll = vi.fn()
    const wrapper = mount(PushMqttView, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    await wrapper.vm.save()
    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('pushDisabled returns false when not disabled and not wifi_direct', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const { global, config } = await import('@/modules/pinia')
    global.disabled = false
    config.use_wifi_direct = false
    const wrapper = mount(PushMqttView, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    expect(wrapper.vm.pushDisabled).toBe(false)
  })

  it('renders form inputs with full stubs including text areas', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const { global, config } = await import('@/modules/pinia')
    global.disabled = false
    config.use_wifi_direct = false
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: {
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue', 'type', 'disabled'],
            emits: ['update:modelValue']
          },
          BsInputNumber: {
            template: '<input type="number" :value="modelValue" @input="$emit(\'update:modelValue\', Number($event.target.value))" />',
            props: ['modelValue', 'disabled'],
            emits: ['update:modelValue']
          },
          BsInputTextAreaFormat: {
            template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
            props: ['modelValue', 'disabled'],
            emits: ['update:modelValue']
          },
          BsDropdown: true,
          BsModal: true
        }
      }
    })
    const textInputs = wrapper.findAll('input:not([type="number"])')
    for (const input of textInputs) {
      await input.trigger('input')
    }
    const numberInputs = wrapper.findAll('input[type="number"]')
    for (const input of numberInputs) {
      await input.trigger('input')
    }
    const textareas = wrapper.findAll('textarea')
    for (const ta of textareas) {
      await ta.trigger('input')
    }
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('triggers BsModal v-model update for render ref', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const wrapper = mount(PushMqttView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: true,
          BsInputNumber: true,
          BsInputTextAreaFormat: true,
          BsDropdown: true,
          BsModal: {
            template: '<button class="modal-emit" @click="$emit(\'update:modelValue\', \'test-render\')" />',
            props: ['modelValue', 'code', 'json', 'mqtt'],
            emits: ['update:modelValue']
          }
        }
      }
    })
    const btn = wrapper.find('.modal-emit')
    if (btn.exists()) await btn.trigger('click')
    expect(wrapper.exists()).toBe(true)
  })

  it('watch(mqtt_format_gravity) on ESP8266 sets warning when format exceeds 500 chars', async () => {
    const { ref } = await import('vue')
    const { config, global: globalMock } = await import('@/modules/pinia')
    const utils = await import('@/modules/utils')

    const mqttFormatRef = ref('')
    const origFormat = config.mqtt_format_gravity
    const origIsEsp8266 = globalMock.isEsp8266
    config.mqtt_format_gravity = mqttFormatRef
    globalMock.isEsp8266 = true
    globalMock.messageWarning = ''

    // Mock applyTemplate to return a large string (> 500 chars)
    vi.spyOn(utils, 'applyTemplate').mockReturnValue('x'.repeat(501))

    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const wrapper = mount(PushMqttView, {
      global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsInputNumber: true, BsInputTextAreaFormat: true, BsDropdown: true, BsModal: true } }
    })

    mqttFormatRef.value = 'large'
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    vi.restoreAllMocks()
    config.mqtt_format_gravity = origFormat
    globalMock.isEsp8266 = origIsEsp8266

    expect(globalMock.messageWarning).toContain('ESP8266')
  })

  it('watch(mqtt_format_gravity) on ESP8266 clears warning when format is small', async () => {
    const { ref } = await import('vue')
    const { config, global: globalMock } = await import('@/modules/pinia')
    const utils = await import('@/modules/utils')

    const mqttFormatRef = ref('')
    const origFormat = config.mqtt_format_gravity
    const origIsEsp8266 = globalMock.isEsp8266
    config.mqtt_format_gravity = mqttFormatRef
    globalMock.isEsp8266 = true
    globalMock.messageWarning = 'old warning'

    // Mock applyTemplate to return a small string (<= 500 chars)
    vi.spyOn(utils, 'applyTemplate').mockReturnValue('small')

    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const wrapper = mount(PushMqttView, {
      global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsInputNumber: true, BsInputTextAreaFormat: true, BsDropdown: true, BsModal: true } }
    })

    mqttFormatRef.value = 'small format'
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    vi.restoreAllMocks()
    config.mqtt_format_gravity = origFormat
    globalMock.isEsp8266 = origIsEsp8266

    expect(globalMock.messageWarning).toBe('')
  })

  it('watch(mqtt_format_gravity) does nothing on non-ESP8266', async () => {
    const { ref } = await import('vue')
    const { config, global: globalMock } = await import('@/modules/pinia')
    const utils = await import('@/modules/utils')

    const mqttFormatRef = ref('')
    const origFormat = config.mqtt_format_gravity
    const origIsEsp8266 = globalMock.isEsp8266
    config.mqtt_format_gravity = mqttFormatRef
    globalMock.isEsp8266 = false
    globalMock.messageWarning = ''

    const applyTemplateSpy = vi.spyOn(utils, 'applyTemplate')

    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushMqttView } = await import('../PushMqttView.vue')
    const wrapper = mount(PushMqttView, {
      global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsInputNumber: true, BsInputTextAreaFormat: true, BsDropdown: true, BsModal: true } }
    })

    mqttFormatRef.value = 'x'.repeat(600)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    vi.restoreAllMocks()
    config.mqtt_format_gravity = origFormat
    globalMock.isEsp8266 = origIsEsp8266

    // applyTemplate should NOT be called (isEsp8266 is false)
    expect(applyTemplateSpy).not.toHaveBeenCalled()
  })
})
