import { BusinessDeploymentService } from '@backend/services/businessDeploymentService'
import { AssistantService } from '@backend/services/assistantService'
import { PhoneNumberService } from '@backend/services/phoneNumberService'
import { BusinessConfig } from '@backend/types/business'

const assistantService = new AssistantService(process.env.VAPI_API_KEY!)
const phoneNumberService = new PhoneNumberService(process.env.VAPI_API_KEY!)
const deploymentService = new BusinessDeploymentService(
  assistantService,
  phoneNumberService
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { config } = body as { config: BusinessConfig }

    const result = await deploymentService.deployBusinessAssistant(config)

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Deployment error:', error)
    return new Response(
      JSON.stringify({ error: 'Deployment failed' }), 
      { status: 500 }
    )
  }
} 