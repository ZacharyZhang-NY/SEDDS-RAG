import React from 'react';
import PasswordResetForm from "@/app/admin/settings/password-reset-form";

const Page = () => {
  return (
    <div>
      <h1 className='text-2xl font-bold'>设置</h1>
      <Settings />
    </div>
  );
};

const Settings = () => {
  return (
    <div className='mt-8'>
      <PasswordResetForm />

    </div>
  )
}

export default Page;