import { useSnackbar } from 'notistack';
import { useCallback } from 'react';

export default function useTotas() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const totasDefault = useCallback(
    (text: string, timer?: number) => {
      const key =  enqueueSnackbar(text, { variant: "default" })
      setTimeout(() => {
        closeSnackbar(key)
      },timer|| 2500);
    },
    [closeSnackbar, enqueueSnackbar],
  )
  const totasError = useCallback(
    (text: string, timer?: number) => {
      const key =  enqueueSnackbar(text, { variant: "error" })
      setTimeout(() => {
        closeSnackbar(key)
      },timer || 2500);
    },
    [closeSnackbar, enqueueSnackbar],
  )
  const totasSuccess = useCallback(
   (text: string, timer?: number)  => {
      const key =  enqueueSnackbar(text, { variant: "success" })
      setTimeout(() => {
        closeSnackbar(key)
      },timer || 2500);
    },
    [closeSnackbar, enqueueSnackbar],
  )
  const totasWarning = useCallback(
   (text: string, timer?: number)  => {
      const key =  enqueueSnackbar(text, { variant: "warning" })
      setTimeout(() => {
        closeSnackbar(key)
      },timer || 2500);
    },
    [closeSnackbar, enqueueSnackbar],
  )
  const totasInfo = useCallback(
   (text: string, timer?: number)  => {
      const key =  enqueueSnackbar(text, { variant: "info" })
      setTimeout(() => {
        closeSnackbar(key)
      },timer || 2500);
    },
    [closeSnackbar, enqueueSnackbar],
  )

  return (
    {
      totasDefault,
      totasError,
      totasSuccess,
      totasWarning,
      totasInfo
    }
  )
}
