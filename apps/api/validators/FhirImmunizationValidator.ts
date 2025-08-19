
    export const validate = (data:{[key:string]:unknown,resourceType:string}) => {
      const requiredFields = [
        'resourceType',
        'status',
        'vaccineCode',
        'patient',
        'occurrenceDateTime',
        'manufacturer',
        'lotNumber',
        'expirationDate'
      ];
  
      for (const field of requiredFields) {
        if (!data[field]) {
          return { valid: false, error: `Missing field: ${field}` };
        }
      }
  
      if (data.resourceType !== 'Immunization') {
        return { valid: false, error: 'Invalid resourceType' };
      }
  
      return { valid: true };
    }
  
  