<template>
    <div>
        <AuthBackArrow @click="goBack" className="text-2xl flex w-full" label />
        <Divider v-if="showDivider" class="mt-4" />
    </div>
</template>

<script setup lang="ts">



    interface Props {
        showDivider?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        showDivider: true,
    })

    const router = useRouter()

    const goBack = () => {
        router.back()
    }
</script>

<style scoped></style>