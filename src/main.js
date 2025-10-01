import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import piniaInstance from './modules/pinia.js'
app.use(piniaInstance)

import router from './modules/router.js'
app.use(router)

// Manual component registration (fallback while debugging auto-registration)
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
import BsModal from './components/BsModal.vue'
import BsModalConfirm from './components/BsModalConfirm.vue'
import BsInputTextAreaFormat from './components/BsInputTextAreaFormat.vue'
import BsMenuBar from './components/BsMenuBar.vue'
import BsFooter from './components/BsFooter.vue'

// Icon components
import IconHome from './components/IconHome.vue'
import IconTools from './components/IconTools.vue'
import IconGraphUpArrow from './components/IconGraphUpArrow.vue'
import IconCloudUpArrow from './components/IconCloudUpArrow.vue'
import IconUpArrow from './components/IconUpArrow.vue'
import IconCpu from './components/IconCpu.vue'
import IconWifi from './components/IconWifi.vue'
import IconEye from './components/IconEye.vue'
import IconEyeSlash from './components/IconEyeSlash.vue'
import IconCheckCircle from './components/IconCheckCircle.vue'
import IconXCircle from './components/IconXCircle.vue'
import IconExclamationTriangle from './components/IconExclamationTriangle.vue'
import IconInfoCircle from './components/IconInfoCircle.vue'

// Register Bootstrap components
app.component('BsMessage', BsMessage)
app.component('BsCard', BsCard)
app.component('BsFileUpload', BsFileUpload)
app.component('BsProgress', BsProgress)
app.component('BsInputBase', BsInputBase)
app.component('BsInputText', BsInputText)
app.component('BsInputReadonly', BsInputReadonly)
app.component('BsSelect', BsSelect)
app.component('BsInputTextArea', BsInputTextArea)
app.component('BsInputNumber', BsInputNumber)
app.component('BsInputSwitch', BsInputSwitch)
app.component('BsInputRadio', BsInputRadio)
app.component('BsDropdown', BsDropdown)
app.component('BsModal', BsModal)
app.component('BsModalConfirm', BsModalConfirm)
app.component('BsInputTextAreaFormat', BsInputTextAreaFormat)
app.component('BsMenuBar', BsMenuBar)
app.component('BsFooter', BsFooter)

// Register Icon components
app.component('IconHome', IconHome)
app.component('IconTools', IconTools)
app.component('IconGraphUpArrow', IconGraphUpArrow)
app.component('IconCloudUpArrow', IconCloudUpArrow)
app.component('IconUpArrow', IconUpArrow)
app.component('IconCpu', IconCpu)
app.component('IconWifi', IconWifi)
app.component('IconEye', IconEye)
app.component('IconEyeSlash', IconEyeSlash)
app.component('IconCheckCircle', IconCheckCircle)
app.component('IconXCircle', IconXCircle)
app.component('IconExclamationTriangle', IconExclamationTriangle)
app.component('IconInfoCircle', IconInfoCircle)

import 'bootstrap/dist/css/bootstrap.css'

app.mount('#app')

//import '@popperjs/core/dist/umd/popper.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.js'
