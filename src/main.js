import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import { router } from './modules/router'
import { piniaInstance } from './modules/pinia'

app.use(router)
app.use(piniaInstance)

import BsMessage from './components/BsMessage.vue'
import BsCard from './components/BsCard.vue'
import BsFileUpload from './components/BsFileUpload.vue'
import BsProgress from './components/BsProgress.vue'
import BsInputBase from './components/BsInputBase.vue'
import BsInputText from './components/BsInputText.vue'
import BsInputReadonly from './components/BsInputReadonly.vue'
import BsSelect from './components/BsSelect.vue'
import BsInputTextArea from './components/BsInputTextArea.vue'
import BsInputNumber from './components/BsInputNumber.vue'
import BsInputSwitch from './components/BsInputSwitch.vue'
import BsInputRadio from './components/BsInputRadio.vue'
import BsDropdown from './components/BsDropdown.vue'

app.component('BsMessage', BsMessage)
app.component('BsDropdown', BsDropdown)
app.component('BsCard', BsCard)
app.component('BsFileUpload', BsFileUpload)
app.component('BsProgress', BsProgress)
app.component('BsInputBase', BsInputBase)
app.component('BsInputText', BsInputText)
app.component('BsInputReadonly', BsInputReadonly)
app.component('BsSelect', BsSelect)
app.component('BsInputTextArea', BsInputTextArea)
app.component('BsInputNumber', BsInputNumber)
app.component('BsInputRadio', BsInputRadio)
app.component('BsInputSwitch', BsInputSwitch)

import IconHome from './components/IconHome.vue'
import IconTools from './components/IconTools.vue'
import IconGraphUpArrow from './components/IconGraphUpArrow.vue'
import IconUpArrow from './components/IconUpArrow.vue'
import IconCpu from './components/IconCpu.vue'

app.component('IconHome', IconHome)
app.component('IconTools', IconTools)
app.component('IconGraphUpArrow', IconGraphUpArrow)
app.component('IconUpArrow', IconUpArrow)
app.component('IconCpu', IconCpu)

import BsModal from './components2/BsModal.vue'
import BsModalConfirm from './components2/BsModalConfirm.vue'
import BsInputTextAreaFormat from './components2/BsInputTextAreaFormat.vue'

app.component('BsModal', BsModal)
app.component('BsModalConfirm', BsModalConfirm)
app.component('BsInputTextAreaFormat', BsInputTextAreaFormat)

//import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.css'

app.mount('#app')

//import '@popperjs/core/dist/umd/popper.min.js'
//import 'bootstrap/dist/js/bootstrap.bundle.min.js'
//import 'bootstrap/dist/js/bootstrap.bundle.js'
