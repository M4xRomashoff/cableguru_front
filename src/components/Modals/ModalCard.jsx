import React from 'react';
import {
  Box, Stack, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CenteredModal from './CenteredModal';
import Selector, { DEFAULT_SELECTOR_FIELDS } from '../Selectors/Selector';
import CustomCheckbox from '../CustomCheckbox';
import BackdropLoading from '../BackdropLoading';
import CustomInput from '../Inputs';
import PhoneInput from '../Inputs/PhoneInput';
import ModalColumnTitle from './components/ModalColumnTitle';
import { AsyncAutocomplete } from '../AutoCompletes/AsyncAutocomplete';
import { TextTitle } from '../Text';
import CloseModalButton from '../Buttons/CloseModalButton';
import CustomButton from '../Buttons/CustomButton';

const columnContainer = {
  display: 'flex',
  flexDirection: 'column',
};

const inputStyle = { width: '350px', mb: 2 };

function Inputs({
  inputFields, handleChange, selectorOption, inputData, error,
}) {
  return inputFields?.map(({
    id,
    label,
    type,
    multiply,
    translate,
    fields,
    disabled,
    visible,
    hide,
    request,
    error: inputError,
    useDefaultFilter,
    selectFirstOption,
    component,
    multiline,
    required,
  }) => {
    if (!(visible === undefined || visible?.(inputData))) return null;
    if (hide?.(inputData)) return null;

    if (component) return component;

    const computedId = typeof id === 'function' ? id(inputData) : id;
    const autocompleteError = typeof inputError === 'function' ? inputError(error) : error?.[computedId]?.[fields?.id || 'id'];
    const computedLabel = typeof label === 'function' ? label(inputData) : label;
    const computedValue = inputData[computedId];
    const computedDisabled = typeof disabled === 'function' ? disabled(inputData) : disabled;
    const onChange = handleChange(computedId);

    if (type === 'autocomplete') {
      return (
        <AsyncAutocomplete
          required={required}
          multiline={multiline}
          selectFirstOption={selectFirstOption}
          useDefaultFilter={useDefaultFilter}
          key={computedId}
          label={computedLabel}
          id={computedId}
          error={autocompleteError}
          sx={inputStyle}
          value={computedValue}
          onChange={onChange}
          optionField={fields}
          disabled={computedDisabled}
          request={request}
          name={computedId}
        />
      );
    }

    if (type === 'select') {
      return (
        <Selector
          required={required}
          key={computedId}
          fields={fields || DEFAULT_SELECTOR_FIELDS}
          label={computedLabel}
          error={error[computedId]?.[fields?.value || DEFAULT_SELECTOR_FIELDS.value]}
          disabled={computedDisabled}
          onChange={onChange}
          value={computedValue}
          options={selectorOption[computedId]}
          sx={inputStyle}
        />
      );
    }
    if (type === 'checkbox') {
      if (multiply && computedValue !== undefined) {
        return Object.keys(computedValue).map((permission) => (
          <CustomCheckbox
            required={required}
            key={permission}
            sx={inputStyle}
            error={error[computedId]}
            disabled={computedDisabled}
            label={translate[permission]}
            value={computedValue[permission]}
            onChange={(event, value) => onChange(event, {
              ...computedValue, [permission]: value,
            })}
          />
        ));
      }

      return (
        <CustomCheckbox
          required={required}
          key={computedId}
          label={computedLabel}
          sx={inputStyle}
          disabled={computedDisabled}
          error={error[computedId]}
          value={computedValue}
          onChange={onChange}
        />
      );
    }
    const Component = type === 'tel' ? PhoneInput : CustomInput;
    return (
      <Component
        required={required}
        key={computedId}
        sx={inputStyle}
        id={computedId}
        disabled={computedDisabled}
        error={error[computedId]}
        label={computedLabel}
        type={type}
        value={computedValue}
        onChange={onChange}
      />
    );
  });
}

export default function ModalCard({
  title,
  subTitle,
  inputs,
  containerMaxWidth = 'md',
  open,
  close,
  selectorOption,
  error = {},
  handleChange,
  inputData,
  isLoading,
  additionalComponents,
  firstButtonProp,
  secondButtonProp,
  additionalContainer,
}) {
  return (
    <CenteredModal close={close} containerMaxWidth={containerMaxWidth} open={open}>
      <Box m={4}>
        <Box
          mb={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {title && <TextTitle h1>{title}</TextTitle>}

          <CloseModalButton close={close} />
        </Box>
        {subTitle && (
          <Typography mb={4} fontWeight="bold" fontSize="26px">
            {subTitle}
          </Typography>
        )}

        <Box position="relative">
          <BackdropLoading position="absolute" isLoading={isLoading} />
          <Box position="relative" display="flex" flexDirection="row" gap={5}>
            {inputs?.map(
              ({
                id, title: inputTitle, inputFields, containers, visible, hide,
              }) => {
                if (!(visible === undefined || visible?.(inputData))) return null;
                if (hide?.(inputData)) return null;

                return (
                  <Box display="flex" flexDirection="column" key={id} sx={containers?.length && columnContainer}>
                    {inputTitle && <ModalColumnTitle>{inputTitle}</ModalColumnTitle>}
                    <Inputs
                      error={error}
                      inputFields={inputFields}
                      handleChange={handleChange}
                      selectorOption={selectorOption}
                      inputData={inputData}
                    />

                    {containers?.map(({
                      id: containerId,
                      title: containerTitle,
                      inputFields: containerInputFields,
                      visible: containerVisible,
                      hide: containerHide,
                    }) => {
                      if (!(containerVisible === undefined || containerVisible?.(inputData))) {
                        return null;
                      }
                      if (containerHide?.(inputData)) return null;

                      return (
                        <Box key={containerId} width="403px" maxWidth="100%">
                          <ModalColumnTitle>{containerTitle}</ModalColumnTitle>
                          <Inputs
                            error={error}
                            inputFields={containerInputFields}
                            handleChange={handleChange}
                            selectorOption={selectorOption}
                            inputData={inputData}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                );
              },
            )}
            {additionalComponents}
          </Box>

          {additionalContainer}

          <Box display="flex" justifyContent="flex-end">
            <Stack direction="row" spacing={4}>
              {firstButtonProp && (
                <CustomButton
                  variant="text"
                  color="error"
                  onClick={firstButtonProp.onClick}
                  startIcon={<DeleteIcon />}
                >
                  {firstButtonProp.label}
                </CustomButton>
              )}
              {secondButtonProp && (
                <CustomButton
                  onClick={secondButtonProp.onClick}
                  variant="contained"
                >
                  {secondButtonProp.label}
                </CustomButton>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </CenteredModal>
  );
}
