import execPromise from "../../utils/execPromise";
import getPostgresContainerId from "./getPostgresContainerId";

export default async function (): Promise<void> {
  const postgresContainerID = await getPostgresContainerId();

  await execPromise(
    `docker exec -t ${postgresContainerID} sh -c 'pg_restore -c -v -U postgres -d starter-service backup'`
  );
}
