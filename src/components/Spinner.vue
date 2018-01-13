<template lang="pug">
  .container.text-center
    p
      i.icon-spinner5
    p {{label}}
</template>



<script>
  export default {
    props: {
      label: {
        type: String,
        default: 'loading'
      }
    }
  }
</script>


<style lang="sass">
</style>
