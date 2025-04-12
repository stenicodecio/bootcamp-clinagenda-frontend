import { dateFormat, DateFormatEnum, normalize } from '@/utils'
import { createServer, Model } from 'miragejs'

export default function () {
  createServer({
    models: {
      status: Model,
      specialty: Model,
      patient: Model,
      doctor: Model,
      appointment: Model
    },
    seeds(server) {
      server.create('status', { id: 1, name: 'Ativo' } as object)
      server.create('status', { id: 2, name: 'Inativo' } as object)

      server.create('specialty', { id: 1, name: 'Cardiologia', scheduleDuration: 60 } as object)
      server.create('specialty', { id: 2, name: 'Psicologia', scheduleDuration: 30 } as object)

      server.create('patient', {
        id: 1,
        name: 'Joana da Silva',
        documentNumber: '12345678900',
        phoneNumber: '19912124545',
        birthDate: '1990-05-13',
        statusId: 1
      } as object)

      server.create('patient', {
        id: 2,
        name: 'João da Silva',
        documentNumber: '98765432100',
        phoneNumber: '19987875454',
        birthDate: '1992-06-10',
        statusId: 2
      } as object)

      server.create('doctor', {
        id: 1,
        name: 'Dra. Scomparim',
        statusId: 1,
        specialty: [1, 2]
      } as object)

      server.create('doctor', {
        id: 2,
        name: 'Dr. Barros',
        statusId: 2,
        specialty: [1]
      } as object)

      server.create('appointment', {
        id: 1,
        patientId: 1,
        doctorId: 2,
        specialtyId: 1,
        appointmentDate: '2025-04-12 10:30:00',
        observation: 'Precisa de atestado médico no final da consulta'
      } as object)
    },
    routes() {
      this.urlPrefix = 'http://localhost:5001/api/'

      // Status
      this.get('status/list', (schema) => {
        const items = schema.all('status').models

        return {
          total: items.length,
          items
        }
      })

      this.post('status/insert', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        schema.create('status', attrs)
        return {}
      })

      this.delete('status/delete/:id', (schema, request) => {
        schema.find('status', request.params.id)?.destroy()
        return {}
      })

      // Specialty
      this.get('specialty/list', (schema, request) => {
        const items = schema
          .all('specialty')
          .models.filter((specialty: any) =>
            specialty.name.toLowerCase().includes(request.queryParams.name || '')
          )

        return {
          total: items.length,
          items
        }
      })

      this.post('specialty/insert', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        schema.create('specialty', attrs)
        return {}
      })

      this.delete('specialty/delete/:id', (schema, request) => {
        schema.find('specialty', request.params.id)?.destroy()
        return {}
      })

      // Patient
      this.get('patient/list', (schema, request) => {
        const items = schema
          .all('patient')
          .models.filter(
            (patient: any) =>
              normalize(patient.name)
                .toLowerCase()
                .includes(normalize(request.queryParams.name as string)) &&
              patient.documentNumber.includes(request.queryParams.documentNumber) &&
              (request.queryParams.statusId
                ? patient.statusId == request.queryParams.statusId
                : true)
          )
          .map((patient: any) => {
            const status = schema.find('status', patient.statusId)?.attrs
            patient.attrs.status = status
            patient.birthDate = dateFormat(patient.birthDate, DateFormatEnum.FullDate.value)
            return patient
          })

        return {
          total: items.length,
          items
        }
      })

      this.get('patient/autocomplete', (schema, request) => {
        const items = schema
          .all('patient')
          .models.filter((patient: any) =>
            normalize(patient.name)
              .toLowerCase()
              .includes(normalize(request.queryParams.name as string))
          )
          .map((patient: any) => {
            const status = schema.find('status', patient.statusId)?.attrs
            patient.attrs.status = status
            patient.birthDate = dateFormat(patient.birthDate, DateFormatEnum.FullDate.value)
            return patient
          })

        return items
      })

      this.post('patient/insert', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        schema.create('patient', attrs)
        return {}
      })

      this.get('patient/listById/:id', (schema, request) => {
        const response: any = schema.find('patient', request.params.id)?.attrs
        const status = schema.find('status', response.statusId)?.attrs
        response.status = status
        response.birthDate = dateFormat(response.birthDate, DateFormatEnum.FullDate.value)

        return response
      })

      this.put('patient/update/:id', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        schema.find('patient', request.params.id)?.update(attrs)
        return {}
      })

      this.delete('patient/delete/:id', (schema, request) => {
        schema.find('patient', request.params.id)?.destroy()
        return {}
      })

      // Doctor
      this.get('doctor/list', (schema, request) => {
        const items = schema
          .all('doctor')
          .models.filter(
            (doctor: any) =>
              normalize(doctor.name)
                .toLowerCase()
                .includes(normalize(request.queryParams.name as string)) &&
              (request.queryParams.statusId
                ? doctor.statusId == request.queryParams.statusId
                : true) &&
              (request.queryParams.specialtyId
                ? doctor.specialty.includes(Number(request.queryParams.specialtyId))
                : true)
          )
          .map((doctor: any) => {
            const status = schema.find('status', doctor.statusId)?.attrs
            doctor.attrs.status = status

            const specialty = schema.all('specialty').models.filter((specialty: any) => {
              return doctor.specialty.includes(Number(specialty.id))
            })

            doctor.attrs.status = status
            doctor.attrs.specialty = specialty
            return doctor
          })

        return {
          total: items.length,
          items
        }
      })

      this.post('doctor/insert', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        schema.create('doctor', attrs)
        return {}
      })

      this.get('doctor/listById/:id', (schema, request) => {
        const response: any = schema.find('doctor', request.params.id)?.attrs

        const status = schema.find('status', response.statusId)?.attrs
        response.status = status

        const specialty: any = []
        response.specialty.map((specialtyId: any) => {
          specialty.push(schema.find('specialty', specialtyId)?.attrs)
        })

        response.specialty = specialty

        return response
      })

      this.put('doctor/update/:id', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        attrs.specialty = attrs.specialty.map((item: any) => Number(item))
        schema.find('doctor', request.params.id)?.update(attrs)
        return {}
      })

      this.delete('doctor/delete/:id', (schema, request) => {
        schema.find('doctor', request.params.id)?.destroy()
        return {}
      })

      // Appointment
      this.get('appointment/list', (schema) => {
        const items = schema.all('appointment').models.map((appointment: any) => {
          const patient = schema.find('patient', appointment.patientId)?.attrs
          appointment.attrs.patient = patient

          const doctor = schema.find('doctor', appointment.doctorId)?.attrs
          appointment.attrs.doctor = doctor

          const specialty = schema.find('specialty', appointment.specialtyId)?.attrs
          appointment.attrs.specialty = specialty

          appointment.appointmentDate = dateFormat(
            appointment.appointmentDate,
            DateFormatEnum.FullDateAndTime.value
          )

          return appointment
        })

        return {
          total: items.length,
          items
        }
      })

      this.post('appointment/insert', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        schema.create('appointment', attrs)
        return {}
      })

      this.get('appointment/listById/:id', (schema, request) => {
        const response: any = schema.find('appointment', request.params.id)?.attrs

        response.specialtyId = response.specialtyId.toString()

        response.appointmentDate = dateFormat(
          response.appointmentDate,
          DateFormatEnum.FullDateAndTime.value
        )

        return response
      })

      this.put('appointment/update/:id', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        schema.find('appointment', request.params.id)?.update(attrs)
        return {}
      })

      this.delete('appointment/delete/:id', (schema, request) => {
        schema.find('appointment', request.params.id)?.destroy()
        return {}
      })
    }
  })
}
