 import {AppointmentStatusFHIRBundle,AppointmentStatusFHIRBundleEntry,AppointmentStatus, MongoPurposeOfVisit, FhirPurposeOfVisit, AppointmentType, FhirHealthcareService} from "@yosemite-crew/types"



export class AppointmentsStatusFHIRConverter {
  private status: string;
  private page: number;
  private limit: number;
  private totalCount: number;
  private totalPages: number;
  private hasMore: boolean;
  private appointments: AppointmentStatus[];

  constructor({
    status,
    page = 1,
    limit = 10,
    totalPages,
    totalCount = 0,
    hasMore,
    appointments = [],
  }: {
    status: string;
    page?: number;
    limit?: number;
    totalPages?: number;
    totalCount?: number;
    hasMore?: boolean;
    appointments?: AppointmentStatus[];
  }) {
    this.status = status;
    this.page = page;
    this.limit = limit;
    this.totalCount = totalCount || appointments.length;
    this.totalPages = totalPages || Math.ceil(this.totalCount / this.limit);
    this.hasMore = hasMore ?? this.page < this.totalPages;
    this.appointments = appointments;
  }

  public toFHIRBundle(): AppointmentStatusFHIRBundle {
    const entries: AppointmentStatusFHIRBundleEntry[] = this.appointments.map((appt) => {
      const appointmentTime = appt.appointmentTime || "00:00";

      return {
        fullUrl: `Appointment/${appt._id}`,
        resource: {
          resourceType: "Appointment",
          id: appt._id,
          status: this.status.toLowerCase(),
          start: appt.appointmentDate,
          description: `${appt.petName} with ${appt.veterinarian || "N/A"}`,
          participant: [
            {
              actor: { display: appt.ownerName },
              status: "accepted",
            },
            {
              actor: { display: appt.veterinarian || "N/A" },
              status: "accepted",
            },
          ],
          reasonCode: [
            {
              text: appt.department,
            },
          ],
          extension: [
            {
              url: "http://example.org/fhir/StructureDefinition/appointment-time",
              valueString: appointmentTime,
            },
          ],
        },
      };
    });

    const links = [
      { relation: "self", url: `?page=${this.page}&limit=${this.limit}` },
      ...(this.hasMore
        ? [{ relation: "next", url: `?page=${this.page + 1}&limit=${this.limit}` }]
        : []),
    ];

    return {
      resourceType: "Bundle",
      type: "searchset",
      total: this.totalCount,
      link: links,
      entry: entries,
      page: this.page,
      limit: this.limit,
      totalPages: this.totalPages,
      hasMore: this.hasMore,
    };
  }
 
  
}







//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<purpose of visit & Appointment Types>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export function convertToFhirPurposeOfVisit(data: { _id: string; name: string }[]): FhirPurposeOfVisit[] {
  return data.map((item) => ({
    resourceType: "Basic",
    id: item._id,
    code: {
      coding: [
        {
          system: "http://example.org/fhir/purpose-of-visit",
          code: item._id,
          display: item.name,
        },
      ],
      text: item.name,
    },
  }));
}

export function convertFromFhirPurposeOfVisit(fhirData: FhirPurposeOfVisit[]): { _id: string; name: string }[] {
  return fhirData.map((resource) => ({
    _id: resource.id,
    name: resource.code.text,
  }));
}





export function convertToFhirAppointmentTypes(
  data: AppointmentType[]
): FhirHealthcareService[] {
  return data.map((item) => ({
    resourceType: "HealthcareService",
    id: item._id,
    type: [
      {
        coding: [
          {
            system: "http://example.org/fhir/appointment-type",
            code: item.name.toLowerCase().replace(/\s+/g, "-"),
            display: item.name,
          },
        ],
        text: item.name,
      },
    ],
    category: {
      coding: [
        {
          system: "http://example.org/fhir/appointment-category",
          code: item.category.toLowerCase().replace(/\s+/g, "-"),
          display: item.category,
        },
      ],
      text: item.category,
    },
  }));
}


export function convertFromFhirAppointmentTypes(
  fhirData: FhirHealthcareService[]
): AppointmentType[] {
  return fhirData.map((item) => ({
    _id: item.id,
    name: item.type?.[0]?.coding?.[0]?.display || "",
    category: item.category?.coding?.[0]?.display || "",
  }));
}