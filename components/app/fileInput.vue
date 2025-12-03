<template>
    <div class="w-full">
        <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
            {{ label }}
        </label>
        <input 
            ref="fileInput" 
            type="file" 
            class="hidden" 
            @change="handleFileSelect" 
            :accept="accept"
            :multiple="multiple" 
        />
        <div 
            class="w-full h-32 border-2 border-dashed shadow-sm border-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out bg-gray-50 hover:border-primary hover:bg-primary/5"
            :class="{ 'border-primary bg-primary/10 scale-[1.02]': isDragOver }" 
            @click="triggerFileInput"
            @dragover.prevent="handleDragOver" 
            @dragleave.prevent="handleDragLeave" 
            @drop.prevent="handleDrop"
        >
            <div class="flex flex-col justify-center items-center gap-3">
                <AppIcon 
                    name="upload-file" 
                    class="w-9 h-9 text-gray-400 transition-colors duration-300"
                    :class="{ 'text-primary': isDragOver }"
                />
                <div class="text-center text-sm leading-tight">
                    <p class="text-gray-500">
                        <span class="text-primary font-semibold mr-1">Click to upload</span> or drag and drop
                    </p>
                    <p v-if="accept && accept !== '*/*'" class="text-gray-500 text-xs text-center mt-1">
                        ({{ formatAcceptText(accept) }})
                    </p>
                </div>
            </div>
        </div>

        <!-- File Details Section - Only show when files are selected -->
        <div v-if="selectedFiles.length > 0" class="mt-3 space-y-2">
            <div 
                v-for="(file, index) in selectedFiles" 
                :key="index"
                class="flex justify-between items-center p-3 border border-gray-300 rounded-lg bg-white"
            >
                <div class="flex items-center gap-3">
                    <AppIcon name="filewithimage" class="w-9 h-9 text-gray-400" />
                    <div>
                        <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                        <p class="text-xs text-gray-500">
                            {{ formatFileSize(file.size) }} - 
                            <span>{{ uploadProgress[index] || 0 }}% Uploaded</span>
                        </p>
                    </div>
                </div>
                <AppIcon 
                    name="close" 
                    filled
                    class="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" 
                    @click="removeFile(index)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    label?: string
    accept?: string
    multiple?: boolean
}

interface Emits {
    (e: 'files-selected', files: File[]): void
    (e: 'files-removed', files: File[]): void
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    accept: '*/*',
    multiple: false
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const selectedFiles = ref<File[]>([])
const uploadProgress = ref<Record<number, number>>({})

const triggerFileInput = (): void => {
    fileInput.value?.click()
}

const handleFileSelect = (event: Event): void => {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (files) {
        processFiles(files)
    }
}

const handleDragOver = (event: DragEvent): void => {
    isDragOver.value = true
}

const handleDragLeave = (event: DragEvent): void => {
    isDragOver.value = false
}

const handleDrop = (event: DragEvent): void => {
    isDragOver.value = false
    const files = event.dataTransfer?.files
    if (files) {
        processFiles(files)
    }
}

const processFiles = (files: FileList): void => {
    const fileArray = Array.from(files)
    
    if (props.multiple) {
        selectedFiles.value = [...selectedFiles.value, ...fileArray]
    } else {
        selectedFiles.value = [fileArray[0]]
    }
    
    // Simulate upload progress for each new file
    fileArray.forEach((_, index) => {
        const fileIndex = selectedFiles.value.length - fileArray.length + index
        simulateUpload(fileIndex)
    })
    
    emit('files-selected', selectedFiles.value)
}

const removeFile = (index: number): void => {
    selectedFiles.value.splice(index, 1)
    delete uploadProgress.value[index]
    
    // Clear the input if no files remain
    if (selectedFiles.value.length === 0 && fileInput.value) {
        fileInput.value.value = ''
    }
    
    emit('files-removed', selectedFiles.value)
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatAcceptText = (accept: string): string => {
    const mimeTypes: Record<string, string> = {
        'image/*': 'Images',
        'image/jpeg': 'JPEG Images',
        'image/png': 'PNG Images',
        'image/gif': 'GIF Images',
        'application/pdf': 'PDF Files',
        'text/plain': 'Text Files',
        'application/msword': 'Word Documents',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Documents'
    }
    
    return mimeTypes[accept] || accept
}

// Simulate upload progress
const simulateUpload = (fileIndex: number): void => {
    let progress = 0
    uploadProgress.value[fileIndex] = 0
    
    const interval = setInterval(() => {
        progress += Math.random() * 20 + 10
        if (progress >= 100) {
            progress = 100
            clearInterval(interval)
        }
        uploadProgress.value[fileIndex] = Math.round(progress)
    }, 300)
}

// Expose methods for parent components
defineExpose({
    clearFiles: () => {
        selectedFiles.value = []
        uploadProgress.value = {}
        if (fileInput.value) {
            fileInput.value.value = ''
        }
    },
    getFiles: () => selectedFiles.value
})
</script>
