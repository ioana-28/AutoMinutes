import { FC } from 'react';
import '@atoms/DocumentUploadInput/DocumentUploadInput.css';
import { IDocumentUploadInputProps } from './IDocumentUploadInput';

const DocumentUploadInput: FC<IDocumentUploadInputProps> = ({
  id = 'meeting-document',
  onChange,
  selectedFileName,
  ...rest
}) => (
  <div className="document-upload-input-field">
    

    <input
      id={id}
      className="document-upload-input-control"
      type="file"
      onChange={onChange}
      {...rest}
    />

    
  </div>
);

export default DocumentUploadInput;
