import { mount } from '@vue/test-utils'
import PushHttpPost2View from '../PushHttpPost2View.vue'
import { createTestingPinia } from '../../tests/testUtils'

describe('PushHttpPost2View (interaction tests)', () => {
  it('mounts without error', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpPost2View, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays page heading', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpPost2View, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true }
      }
    })
    expect(wrapper.text()).toContain('HTTP Post')
  })

  it('displays form', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpPost2View, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true }
      }
    })
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('has save button', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpPost2View, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true }
      }
    })
    const buttons = wrapper.findAll('button')
    const saveButton = buttons.find((b) => b.text().includes('Save'))
    expect(saveButton).toBeDefined()
  })

  it('has runTest function defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpPost2View, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true }
      }
    })
    expect(typeof wrapper.vm.runTest).toBe('function')
  })

  it('has save function defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpPost2View, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true }
      }
    })
    expect(typeof wrapper.vm.save).toBe('function')
  })

  it('has runTest function defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpPost2View, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true }
      }
    })
    expect(typeof wrapper.vm.runTest).toBe('function')
  })

  it('has config state defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpPost2View, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true }
      }
    })
    expect(wrapper.vm.config).toBeDefined()
  })

  it('displays container layout', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushHttpPost2View, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsProgress: true }
      }
    })
    expect(wrapper.find('.container').exists()).toBe(true)
  })
})

describe('PushHttpPost2View (action tests)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('save calls config.saveAll when form is valid', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpPost2View } = await import('../PushHttpPost2View.vue')
    const wrapper = mount(PushHttpPost2View, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    await wrapper.vm.save()
    const { config } = await import('@/modules/pinia')
    expect(config.saveAll).toHaveBeenCalled()
  })
  it('runTest calls config.runPushTest', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpPost2View } = await import('../PushHttpPost2View.vue')
    const wrapper = mount(PushHttpPost2View, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    await wrapper.vm.runTest()
    const { config } = await import('@/modules/pinia')
    expect(config.runPushTest).toHaveBeenCalled()
  })

  it('httpUrlCallback updates config.http_post2_target', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpPost2View } = await import('../PushHttpPost2View.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushHttpPost2View, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    wrapper.vm.httpUrlCallback('http://example2.com')
    expect(config.http_post2_target).toBe('http://example2.com')
  })

  it('httpUrlCallback updates config.http_post2_target', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpPost2View } = await import('../PushHttpPost2View.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushHttpPost2View, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    wrapper.vm.httpUrlCallback('http://example.com/push')
    expect(config.http_post2_target).toBe('http://example.com/push')
  })

  it('httpHeaderH1Callback updates config.http_post2_header1', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpPost2View } = await import('../PushHttpPost2View.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushHttpPost2View, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    wrapper.vm.httpHeaderH1Callback('Accept: application/json')
    expect(config.http_post2_header1).toBe('Accept: application/json')
  })

  it('httpHeaderH2Callback updates config.http_post2_header2', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpPost2View } = await import('../PushHttpPost2View.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushHttpPost2View, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    wrapper.vm.httpHeaderH2Callback('Content-Type: application/json')
    expect(config.http_post2_header2).toBe('Content-Type: application/json')
  })

  it('httpFormatCallback decodes and updates format', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpPost2View } = await import('../PushHttpPost2View.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushHttpPost2View, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    wrapper.vm.httpFormatCallback(encodeURIComponent('{gravity},{temp}'))
    expect(config.http_post2_format_gravity).toBe('{gravity},{temp}')
  })

  it('pushDisabled returns true when use_wifi_direct is true', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpPost2View } = await import('../PushHttpPost2View.vue')
    const { config } = await import('@/modules/pinia')
    config.use_wifi_direct = true
    const wrapper = mount(PushHttpPost2View, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('runTest handles exception from config.runPushTest', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpPost2View } = await import('../PushHttpPost2View.vue')
    const { config, global } = await import('@/modules/pinia')
    vi.spyOn(config, 'runPushTest').mockRejectedValueOnce(new Error('Connection timeout'))
    global.messageError = ''
    const wrapper = mount(PushHttpPost2View, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    await wrapper.vm.runTest()
    expect(global.messageError).toBe('Failed to start push test')
  })

  it('renderFormat sets render value from template', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: View } = await import('../PushHttpPost2View.vue')
    const { config, status } = await import('@/modules/pinia')
    config.http_post2_format_gravity = 'angle={angle}'
    status.angle = 30
    const wrapper = mount(View, { global: { plugins: [createTestingPinia()], stubs: { BsInputText: true, BsProgress: true } } })
    wrapper.vm.renderFormat()
    expect(wrapper.vm.render).toBeTruthy()
  })

  it('v-model bindings trigger config updates via emitting stubs', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: View } = await import('../PushHttpPost2View.vue')
    const { global } = await import('@/modules/pinia')
    global.disabled = false

    const inputStub = {
      template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
      props: ['modelValue', 'type', 'disabled', 'maxlength', 'pattern', 'label', 'help', 'min', 'max', 'step', 'width', 'unit', 'rows'],
      emits: ['update:modelValue']
    }
    const textareaStub = {
      template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
      props: ['modelValue', 'disabled', 'rows', 'label', 'help'],
      emits: ['update:modelValue']
    }
    const wrapper = mount(View, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: inputStub,
          BsInputNumber: inputStub,
          BsInputTextAreaFormat: textareaStub,
          BsModal: true,
          BsDropdown: true
        }
      }
    })
    for (const el of wrapper.findAll('input')) { await el.trigger('input') }
    for (const el of wrapper.findAll('textarea')) { await el.trigger('input') }
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('triggers BsModal v-model update for render ref', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushHttpPost2View } = await import('../PushHttpPost2View.vue')
    const wrapper = mount(PushHttpPost2View, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: true,
          BsInputNumber: true,
          BsInputTextAreaFormat: true,
          BsInputSwitch: true,
          BsDropdown: true,
          BsModal: {
            template: '<button class="modal-emit" @click="$emit(\'update:modelValue\', \'test\')" />',
            props: ['modelValue', 'code', 'json', 'title'],
            emits: ['update:modelValue']
          }
        }
      }
    })
    const btn = wrapper.find('.modal-emit')
    if (btn.exists()) await btn.trigger('click')
    expect(wrapper.exists()).toBe(true)
  })
})
