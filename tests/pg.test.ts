import { describe, expect, it } from "@jest/globals";
import { getPgStartCommand } from "../scripts/pg";

describe("getPgStartCommand", () => {
  it("returns a recreate command when the postgres container already exists but is stopped", () => {
    const command = getPgStartCommand({
      containerExists: true,
      containerRunning: false,
    });

    expect(command).toContain("docker rm -f mint-postgres");
    expect(command).toContain("docker run --name mint-postgres");
  });

  it("returns a create command when the postgres container does not exist yet", () => {
    const command = getPgStartCommand({
      containerExists: false,
      containerRunning: false,
    });

    expect(command).toContain("docker run --name mint-postgres");
  });

  it("returns a create command that uses the requested host port", () => {
    const command = getPgStartCommand(
      { containerExists: false, containerRunning: false },
      5433,
    );

    expect(command).toContain("-p 5433:5432");
  });

  it("returns null when the postgres container is already running", () => {
    const command = getPgStartCommand({
      containerExists: true,
      containerRunning: true,
    });

    expect(command).toBeNull();
  });
});
