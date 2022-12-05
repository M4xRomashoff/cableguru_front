export function downloadBlobFileOnClick(data, fileName) {
  const href = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.setAttribute('href', href);
  link.setAttribute('download', fileName);
  link.click();
  document.body.removeChild(link);
}

export const getFileExtensions = (
  extensions = ['pdf', 'doc', 'docx'],
) => extensions.map((extension) => `.${extension}`).join(', ');

export const getUrlFromFile = (file) => {
  if (!file) return;
  if (file?.url) return file.url;

  return window.URL.createObjectURL(file);
};

export function blobToFile(theBlob, fileName) {
  // A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

export function removeFileFromFileList(index, input) {
  const dt = new DataTransfer();
  const { files } = input;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (index !== i) dt.items.add(file);
  }

  input.files = dt.files;
}

export function removeAllInputFiles(input) {
  const dt = new DataTransfer();

  input.files = dt.files;
}