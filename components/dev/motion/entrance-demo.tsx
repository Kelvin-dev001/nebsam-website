'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { EnquirySuccess } from '@/components/forms/enquiry-success';

/**
 * The enquiry confirmation, mounted on demand — the real component, with an
 * illustrative reference. It exists so its entrance (`enter-rise`) and its
 * focus handling can be checked without submitting a real enquiry, which
 * would write a row that staff then see in the admin.
 */
export function EntranceDemo() {
  const [shown, setShown] = React.useState(false);

  return (
    <div className="flex flex-col items-start gap-6">
      <Button type="button" variant="secondary" onClick={() => setShown((v) => !v)}>
        {shown ? 'Remove the confirmation' : 'Show the enquiry confirmation'}
      </Button>
      {shown ? (
        <EnquirySuccess
          kind="contact"
          reference="DEMO-0000"
          whatsappMessage="Hello Nebsam, this is the motion playground."
        />
      ) : null}
    </div>
  );
}
