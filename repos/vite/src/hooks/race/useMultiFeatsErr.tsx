
import { useApp } from '@store'
import { useEffect } from 'react'
import { SettingMultiFeatsErr } from '@constants/settings'
import { confirmModal, toggleModal } from '@actions/modals'
import { updateSettingValue } from '@actions/settings/updateSettingValue'
import { MultipleFeatureErr } from '@components/Errors/MultipleFeatureErr'

export type THMultiFeatsErr = {
  duplicates?:string[]
}

export const useMultiFeatsErr = (props:THMultiFeatsErr) => {
  const { duplicates } = props
  const { multiFeatsErr } = useApp()
  
  useEffect(() => {
    !multiFeatsErr
      && duplicates?.length
      && confirmModal({
          maxWidth: `sm`,
          title: `Multiple Features Error`,
          children: (<MultipleFeatureErr files={duplicates} />),
          actionProps: {
            sx: {
              padding: `20px`,
              paddingTop: `0px`,
              justifyContent: `end`,
            }
          },
          actions: [
            {
              text: `OK`,
              color: `success`,
              keyboard: `enter`,
              variant:`contained`,
              onClick: () => {

                updateSettingValue({
                  value: true,
                  setting: SettingMultiFeatsErr
                })

                toggleModal(false)
              },
            },
          ]
        })
  }, [
    duplicates,
    multiFeatsErr,
  ])

}