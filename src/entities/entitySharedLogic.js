export async function makeBlink(k, entity, timespan = 0.1) {
  await k.tween(
    entity.opacity,
    0,
    timespan,
    (val) => (entity.opacity = val),
    k.easings.linear
  );
  k.tween(
    entity.opacity,
    1,
    timespan,
    (val) => (entity.opacity = val),
    k.easings.linear
  );
}
