import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  useCovidStateFormContext,
  useFirstFormContext,
  useIsVacinatedFormContext,
} from '~/state';
import { CovidPoliticsTypes } from '~/types';

const covidPoliticFormStorage =
  localStorage.getItem('covidPoliticForm') !== null
    ? JSON.parse(localStorage.getItem('covidPoliticForm')!)
    : {
        non_formal_meetings: '',
        number_of_days_from_office: '',
        what_about_meetings_in_live: '',
        tell_us_your_opinion_about_us: '',
      };

const useCovidPoliticFormInputs = () => {
  const { covidStateFormInputs } = useCovidStateFormContext();
  const { nameAndEmailFormInputs } = useFirstFormContext();
  const { isVacinatedFormInputs } = useIsVacinatedFormContext();

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { isValid },
  } = useForm<CovidPoliticsTypes>({
    mode: 'onChange',
    defaultValues: covidPoliticFormStorage,
  });

  const userRadioButtonAnswers = useWatch({
    control,
    name: ['non_formal_meetings', 'number_of_days_from_office'],
  });

  useEffect(() => {
    const timer = setTimeout(
      () =>
        localStorage.setItem('covidPoliticForm', JSON.stringify(getValues())),
      400
    );

    return () => clearTimeout(timer);
  }, [userRadioButtonAnswers]);

  const saveCovidPoliticsInformation = () =>
    localStorage.setItem('covidPoliticForm', JSON.stringify(getValues()));

  const onSubmit = (data: CovidPoliticsTypes) => {
    console.log({
      ...data,
      ...covidStateFormInputs,
      ...nameAndEmailFormInputs,
      ...isVacinatedFormInputs,
      number_of_days_from_office: +data.number_of_days_from_office,
    });
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    isValid,
    saveCovidPoliticsInformation,
  };
};

export default useCovidPoliticFormInputs;
