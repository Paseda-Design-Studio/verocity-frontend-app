<template>
    <div>
        <app-single-page-header />
        <section class="p-6">
            <div class="max-w-4xl mx-auto">
                <AppHorizontalStepper :current="currentStep" :steps="steps" />

                <div class="mt-8">
                    <div class="p-6 bg-white shadow rounded-lg">
                        <h2 class="text-xl font-bold mb-2">{{ stepTitle }}</h2>
                        <Divider class="mt-4" />

                        <div class="step-content">
                            <slot />
                        </div>

                        <Divider class="mt-4" />

                        <slot name="actions" />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        currentStep: number
        steps: string[]
        stepTitle: string
    }>()
</script>

<style scoped></style>