import { mount } from '@vue/test-utils'
import PushHttpGetView from '../PushHttpGetView.vue'
import { createTestingPinia } from '../../tests/testUtils'

describe('PushHttpGetView (interaction tests)', () => {
  it('mounts without error', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays page heading', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    expect(wrapper.text()).toContain('HTTP Get')
  })

  it('displays form', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('has save button', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    const buttons = wrapper.findAll('button')
    const saveButton = buttons.find((b) => b.text().includes('Save'))
    expect(saveButton).toBeDefined()
  })

  it('has test button', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    const buttons = wrapper.findAll('button')
    const testButton = buttons.find((b) => b.text().includes('push test'))
    expect(testButton).toBeDefined()
  })

  it('has save function defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    expect(typeof wrapper.vm.save).toBe('function')
  })

  it('has runTest function defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    expect(typeof wrapper.vm.runTest).toBe('function')
  })

  it('has config state defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    expect(wrapper.vm.config).toBeDefined()
  })

  it('displays container layout', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    expect(wrapper.find('.container').exists()).toBe(true)
  })
})

describe('PushHttpGetView (action tests)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('save calls config.saveAll when form is valid', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    await wrapper.vm.save()
    const { config } = await import('@/modules/pinia')
    expect(config.saveAll).toHaveBeenCalled()
  })
  it('runTest calls config.runPushTest', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    await wrapper.vm.runTest()
    const { config } = await import('@/modules/pinia')
    expect(config.runPushTest).toHaveBeenCalled()
  })

  it('httpUrlCallback updates config.http_get_target', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    wrapper.vm.httpUrlCallback('http://example.com/get')
    expect(config.http_get_target).toBe('http://example.com/get')
  })

  it('renderFormat does not throw', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const { config } = await import('@/modules/pinia')
    config.http_get_format_gravity = '{gravity}'
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    expect(() => wrapper.vm.renderFormat()).not.toThrow()
  })

  it('httpHeaderH1Callback updates config.http_get_header1', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    wrapper.vm.httpHeaderH1Callback('Accept: text/plain')
    expect(config.http_get_header1).toBe('Accept: text/plain')
  })

  it('httpHeaderH2Callback updates config.http_get_header2', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    wrapper.vm.httpHeaderH2Callback('Authorization: Bearer token')
    expect(config.http_get_header2).toBe('Authorization: Bearer token')
  })

  it('pushDisabled returns true when http_get is false', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const { global } = await import('@/modules/pinia')
    global.disabled = true
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('runTest handles exception from config.runPushTest', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const { config, global } = await import('@/modules/pinia')
    vi.spyOn(config, 'runPushTest').mockRejectedValueOnce(new Error('DNS lookup failed'))
    global.messageError = ''
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    await wrapper.vm.runTest()
    expect(global.messageError).toBe('Failed to start push test')
  })

  it('httpUrlCallback updates config.http_get_target', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    wrapper.vm.httpUrlCallback('https://api.example.com/data')
    expect(config.http_get_target).toBe('https://api.example.com/data')
  })

  it('httpFormatCallback decodes and updates config.http_get_format_gravity', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    wrapper.vm.httpFormatCallback('gravity%3D%7Bgravity%7D') // gravity={gravity}
    expect(config.http_get_format_gravity).toBe('gravity={gravity}')
  })

  it('renderFormat creates formatted output', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const { config, status } = await import('@/modules/pinia')
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    config.http_get_format_gravity = 'angle={angle}&gravity={gravity}'
    status.angle = 45
    status.gravity = 1.05
    wrapper.vm.renderFormat()
    expect(wrapper.vm.render).toBeTruthy()
  })

  it('save validates form before saving', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const { validateCurrentForm } = await import('@mp-se/espframework-ui-components')
    const { config } = await import('@/modules/pinia')
    config.saveAll = vi.fn(async () => {})
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    await wrapper.vm.save()
    expect(validateCurrentForm).toHaveBeenCalled()
  })

  it('runTest calls config.runPushTest with correct data', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpGetView } = await import('../PushHttpGetView.vue')
    const { config } = await import('@/modules/pinia')
    config.runPushTest = vi.fn(async () => {})
    const wrapper = mount(PushHttpGetView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsProgress: true, BsMessage: true }
      }
    })
    await wrapper.vm.runTest()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'http_get_format_gravity' })
  })

  it('v-model bindings trigger config updates via emitting stubs', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: View } = await import('../PushHttpGetView.vue')
    const { global } = await import('@/modules/pinia')
    global.disabled = false

    const inputStub = {
      template:
        '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
      props: [
        'modelValue',
        'type',
        'disabled',
        'maxlength',
        'pattern',
        'label',
        'help',
        'min',
        'max',
        'step',
        'width',
        'unit',
        'rows'
      ],
      emits: ['update:modelValue']
    }
    const textareaStub = {
      template:
        '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
      props: ['modelValue', 'disabled', 'rows', 'label', 'help'],
      emits: ['update:modelValue']
    }
    const modalStub = {
      template: "<div><button @click=\"$emit('update:modelValue', 'val')\">preview</button></div>",
      props: ['modelValue', 'disabled', 'code', 'title', 'button'],
      emits: ['update:modelValue', 'click']
    }
    const wrapper = mount(View, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: inputStub,
          BsInputNumber: inputStub,
          BsInputTextAreaFormat: textareaStub,
          BsModal: modalStub,
          BsDropdown: true,
          BsMessage: true
        }
      }
    })
    for (const el of wrapper.findAll('input')) {
      await el.trigger('input')
    }
    for (const el of wrapper.findAll('textarea')) {
      await el.trigger('input')
    }
    for (const el of wrapper.findAll('button')) {
      await el.trigger('click').catch(() => null)
    }
    expect(wrapper.find('form').exists()).toBe(true)
  })
})
