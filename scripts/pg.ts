import { execSync } from "child_process";

export interface PgContainerState {
  containerExists: boolean;
  containerRunning: boolean;
}

export function getPgStartCommand(state: PgContainerState, hostPort: number = 5432): string | null {
  if (state.containerRunning) {
    return null;
  }

  const runCommand = `docker run --name mint-postgres --network mint-network -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=mint -p ${hostPort}:5432 -d postgres:15`;

  if (state.containerExists) {
    return `docker rm -f mint-postgres >/dev/null 2>&1 || true && ${runCommand}`;
  }

  return runCommand;
}

function getContainerState(): PgContainerState {
  try {
    const inspect = execSync("docker ps -a --filter name=^/mint-postgres$ --format {{.Names}}", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();

    const containerExists = inspect.length > 0;
    const running = execSync("docker ps --filter name=^/mint-postgres$ --format {{.Names}}", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim().length > 0;

    return { containerExists, containerRunning: running };
  } catch {
    return { containerExists: false, containerRunning: false };
  }
}

function main() {
  try {
    console.log("\n🌐 Setting up Docker network...");
    execSync("docker network inspect mint-network >/dev/null 2>&1 || docker network create mint-network");

    const state = getContainerState();
    let hostPort = Number(process.env.POSTGRES_PORT ?? 5432);
    let startCommand = getPgStartCommand(state, hostPort);

    if (startCommand) {
      console.log("\n🚀 Starting PostgreSQL...");
      try {
        execSync(startCommand);
      } catch (error) {
        const isPortConflict = String(error).includes("port is already allocated") || String(error).includes("Bind for");

        if (hostPort === 5432 && isPortConflict) {
          console.log("\n⚠️ Port 5432 is already in use. Retrying on 5433...");
          hostPort = 5433;
          startCommand = getPgStartCommand(state, hostPort);
          execSync(startCommand);
        } else {
          throw error;
        }
      }
    } else {
      console.log("\nℹ️ PostgreSQL container is already running.");
    }

    console.log("\n✅ PostgreSQL is running!");
    console.log("\nConnection Details:");
    console.log("  Host: localhost");
    console.log("  Port:", hostPort);
    console.log("  Database: mint");
    console.log("  Username: postgres");
    console.log("  Password: postgres");
    console.log("\nConnection URL:");
    console.log(`  postgres://postgres:postgres@localhost:${hostPort}/mint`);
  } catch (error) {
    console.error("\n❌ Failed to start PostgreSQL:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
