import axios from 'axios';

function buildFormData(state) {
  const fd = new FormData();
  ['name', 'jobTitle', 'employeeId', 'admissionDate', 'qrData'].forEach((k) =>
    fd.append(k, state[k] || '')
  );
  if (state.photoFile) fd.append('photo', state.photoFile);
  return fd;
}

export async function generatePng(state) {
  const res = await axios.post('/api/generate/png', buildFormData(state), {
    responseType: 'blob',
  });
  return res.data;
}

export async function generatePdf(state) {
  const res = await axios.post('/api/generate/pdf', buildFormData(state), {
    responseType: 'blob',
  });
  return res.data;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
