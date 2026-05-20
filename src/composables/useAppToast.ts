export function useAppToast() {
  const toast = useToast()

  function success(title: string, description?: string) {
    toast.add({
      title,
      description,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  }

  function info(title: string, description?: string) {
    toast.add({
      title,
      description,
      color: 'info',
      icon: 'i-lucide-info'
    })
  }

  function error(title: string, description?: string) {
    toast.add({
      title,
      description,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }

  return { success, info, error }
}
