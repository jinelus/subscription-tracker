export interface EmailProps {
    userName: string,
    subscriptionName: string,
    renewalDate: string,
    planName: string,
    price: string,
    paymentMethod: 'card' | 'bank' | 'paypal' | 'boleto',
    daysLeft: number,
}

export const generateEmailTemplate = ({
    userName,
    subscriptionName,
    renewalDate,
    planName,
    price,
    paymentMethod,
    daysLeft,
  }: EmailProps) => `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px; text-align: center;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          
          <!-- HEADER -->
          <tr>
              <td style="background-color: #4A90E2; padding: 30px;">
                  <h1 style="color: #ffffff; font-size: 24px; margin: 0;">SubDub</h1>
                  <p style="color: #ffffff; margin: 5px 0 0; font-size: 16px;">Your Subscription Reminder</p>
              </td>
          </tr>
  
          <!-- BODY -->
          <tr>
              <td style="padding: 40px 30px; text-align: left;">
                  <p style="font-size: 16px; color: #333;">Hello <strong style="color: #4A90E2;">${userName}</strong>,</p>
                  
                  <p style="font-size: 16px; margin-bottom: 20px;">
                      Your <strong>${subscriptionName}</strong> subscription is set to renew on <strong style="color: #4A90E2;">${renewalDate}</strong> (${daysLeft} days left).
                  </p>
  
                  <!-- SUBSCRIPTION DETAILS -->
                  <table cellpadding="10" cellspacing="0" border="0" width="100%" style="background: #f4f7fa; border-radius: 10px; padding: 15px; margin-bottom: 20px;">
                      <tr><td><strong>Plan:</strong> ${planName}</td></tr>
                      <tr><td><strong>Price:</strong> ${price}</td></tr>
                      <tr><td><strong>Payment Method:</strong> ${paymentMethod}</td></tr>
                  </table>
              </td>
          </tr>
  
          <!-- FOOTER -->
          <tr>
              <td style="background: #f4f7fa; padding: 20px; text-align: center; font-size: 14px; color: #666;">
                  <p>SubDub Inc. | 123 Main St, Anytown, AN 12345</p>
                  <p>
                      <a href="#" style="color: #4A90E2; text-decoration: none; margin: 0 10px;">Unsubscribe</a> | 
                      <a href="#" style="color: #4A90E2; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                      <a href="#" style="color: #4A90E2; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                  </p>
              </td>
          </tr>
  
      </table>
  </div>
  `;
  
  export const emailTemplates = [
    {
      label: "7 days before reminder",
      generateSubject: (data: EmailProps) =>
        `📅 Reminder: Your ${data.subscriptionName} Subscription Renews in 7 Days!`,
      generateBody: (data: EmailProps) => generateEmailTemplate({ ...data, daysLeft: 7 }),
    },
    {
      label: "5 days before reminder",
      generateSubject: (data: EmailProps) =>
        `⏳ ${data.subscriptionName} Renews in 5 Days – Stay Subscribed!`,
      generateBody: (data: EmailProps) => generateEmailTemplate({ ...data, daysLeft: 5 }),
    },
    {
      label: "2 days before reminder",
      generateSubject: (data: EmailProps) =>
        `🚀 2 Days Left!  ${data.subscriptionName} Subscription Renewal`,
      generateBody: (data: EmailProps) => generateEmailTemplate({ ...data, daysLeft: 2 }),
    },
    {
      label: "1 days before reminder",
      generateSubject: (data: EmailProps) =>
        `⚡ Final Reminder: ${data.subscriptionName} Renews Tomorrow!`,
      generateBody: (data: EmailProps) => generateEmailTemplate({ ...data, daysLeft: 1 }),
    },
  ];
  