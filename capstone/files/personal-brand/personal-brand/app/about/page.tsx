import { profile } from '@/data/profile';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="max-w-content mx-auto px-6 md:px-8 py-16 md:py-20">
      <p className="font-mono text-xs text-amber mb-3">{'> get_profile(section="bio")'}</p>
      <h1 className="font-display text-3xl text-paper mb-10">About</h1>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-5">
          {profile.bio.map((para, i) => (
            <p key={i} className="text-muted leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        <div>
          <p className="font-mono text-xs text-cyan mb-4">{'> get_profile(section="skills")'}</p>
          <div className="space-y-6">
            {profile.skills.map((group) => (
              <div key={group.group}>
                <h3 className="font-display text-sm text-paper mb-2">{group.group}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[11px] text-muted border border-line rounded-sm px-2 py-1"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
