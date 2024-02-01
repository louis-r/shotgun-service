import { z } from 'zod';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const requestValidator = z.object({
    trigramme: z.string(),
});

const shotgunStartTime = new Date('2024-02-01T15:39:00.000Z');
let shotgunWinningTrigramme: string | undefined = undefined;

export async function placeShotgunRequest(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    // We start by logging the event received
    console.log(event);
    // We parse the body of the event received, and throw an error if it is not valid
    const requestPayload = requestValidator.parse(JSON.parse(event.body));
    // We log some information about the rqeuest
    // We check if the shotgun is not opened yet
    if (Date.now() < shotgunStartTime.getTime())
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Shotgun has not started yet' }),
        };
    // We check if the shotgun has already been won
    if (shotgunWinningTrigramme)
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Shotgun already won by ${shotgunWinningTrigramme}` }),
        };
    // We set the winning trigramme and return the congratulations message
    shotgunWinningTrigramme = requestPayload.trigramme;
    return {
        statusCode: 200,
        body: JSON.stringify({ message: `You won the shotgun, congrats ${shotgunWinningTrigramme}!` }),
    };
}
