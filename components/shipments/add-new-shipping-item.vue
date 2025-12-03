<template>
 
</template>

<script setup lang="ts">
    const emit = defineEmits<{
        (e: 'submit', item: any): void;
    }>();

    function submit() {
        // You can emit the submit event with the item data here
        // emit('submit', item);
    }
</script>