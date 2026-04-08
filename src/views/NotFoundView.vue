<!--
  Copyright (c) 2021-2026 Magnus Persson
  https://github.com/mp-se/gravitymon | https://github.com/mp-se/gravitymon-ui

  Licensed under the GNU General Public License v3.0 (GPL v3) for open source use,
  or a Commercial License for proprietary use. See LICENSE and LICENSE_COMMERCIAL.
-->
<template>
  <BsMessage :dismissable="false" alert="danger">
    Page not found! <span class="fw-bold">{{ this.$route.path }}</span> is not a valid URL for this
    application!
  </BsMessage>
</template>
