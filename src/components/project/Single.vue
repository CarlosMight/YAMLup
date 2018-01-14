<template lang="pug">
  .container(v-html='html')
</template>

<script>
  export default {
    name: 'project-single',
    props: ['html']
  }
</script>
