import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Initializes Swagger documentation for the Nest.js application.
 *
 * @param app - An instance of INestApplication representing the Nest.js application.
 */
export function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Employee Leave Manager')
    .setDescription('The Employee Leave Manager description')
    .setVersion('1.0')
    // .addBearerAuth() // TODO uncomment after ading auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
