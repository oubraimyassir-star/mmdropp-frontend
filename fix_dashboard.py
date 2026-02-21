
import os

filepath = r"c:\Users\yassir\Downloads\MMDROPP\src\components\sections\admin-dashboard.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Team Tab: Add Retirer button
target1 = """                                                    <td className="py-4 px-4 text-right">
                                                        <button
                                                            onClick={() => setShowTransferFunds(m)}
                                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                                                        >
                                                            Virement
                                                        </button>
                                                    </td>"""

# Let's try to match exactly what view_file showed
import re
# We'll use regex to match the button and its surrounding td, ignoring indentation if possible but here we want to be precise.
# Actually, let's just use the exact strings from view_file Step 7476
# 469:                                                     <td className="py-4 px-4 text-right">
# 470:                                                         <button
# 471:                                                             onClick={() => setShowTransferFunds(m)}
# 472:                                                             className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"
# 473:                                                         >
# 474:                                                             Virement
# 475:                                                         </button>
# 476:                                                     </td>

target1_exact = '                                                    <td className="py-4 px-4 text-right">\n                                                        <button\n                                                            onClick={() => setShowTransferFunds(m)}\n                                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"\n                                                        >\n                                                            Virement\n                                                        </button>\n                                                    </td>'

replacement1 = """                                                    <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setShowTransferFunds(m)}
                                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                                                        >
                                                            Virement
                                                        </button>
                                                        <button
                                                            onClick={() => handleSetRole(m.id, 'user')}
                                                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                                                            title="Retirer le rôle de Manager"
                                                        >
                                                            Retirer
                                                        </button>
                                                    </td>"""

# 2. Users Tab: Fix <td>
target2_exact = '                                                <div className="flex items-center justify-end gap-2">\n                                                    <button\n                                                        onClick={() => handleSetRole(user.id, user.role === \'management\' ? \'user\' : \'management\')}\n                                                        className={cn(\n                                                            "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",\n                                                            user.role === \'management\'\n                                                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white"\n                                                                : "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500 hover:text-white"\n                                                        )}\n                                                        title={user.role === \'management\' ? "Rétrograder en simple utilisateur" : "Promouvoir en Manager"}\n                                                    >\n                                                        {user.role === \'management\' ? "Manager" : "Promouvoir"}\n                                                    </button>\n                                                    <button\n                                                        onClick={() => handleToggleUserActive(user.id)}\n                                                        className={cn(\n                                                            "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",\n                                                            user.is_active\n                                                                ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white"\n                                                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"\n                                                        )}\n                                                    >\n                                                        {user.is_active ? "Désactiver" : "Activer"}\n                                                    </button>\n                                                </div>'

replacement2 = """                                                <td className="py-4 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleSetRole(user.id, user.role === 'management' ? 'user' : 'management')}
                                                            className={cn(
                                                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                                                                user.role === 'management'
                                                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white"
                                                                    : "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500 hover:text-white"
                                                            )}
                                                            title={user.role === 'management' ? "Rétrograder en simple utilisateur" : "Promouvoir en Manager"}
                                                        >
                                                            {user.role === 'management' ? "Manager" : "Promouvoir"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleUserActive(user.id)}
                                                            className={cn(
                                                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border",
                                                                user.is_active
                                                                    ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white"
                                                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                                                            )}
                                                        >
                                                            {user.is_active ? "Désactiver" : "Activer"}
                                                        </button>
                                                    </div>
                                                </td>"""

# Use regex to find and replace regardless of exact space count if possible, but let's try direct first.
if target1_exact in content:
    print("Found target 1")
    content = content.replace(target1_exact, replacement1)
else:
    # Try with a regex that ignores horizontal whitespace at the start of each line
    print("Target 1 exact not found, trying regex")
    # Escape target1 but handle indentation
    lines1 = [line.strip() for line in target1_exact.split('\n')]
    regex1 = r'^[ \t]*' + r'[ \t]*\n[ \t]*'.join([re.escape(l) for l in lines1])
    if re.search(regex1, content, re.MULTILINE):
        print("Found target 1 with regex")
        content = re.sub(regex1, replacement1, content, flags=re.MULTILINE)

if target2_exact in content:
    print("Found target 2")
    content = content.replace(target2_exact, replacement2)
else:
    print("Target 2 exact not found, trying regex")
    lines2 = [line.strip() for line in target2_exact.split('\n')]
    regex2 = r'^[ \t]*' + r'[ \t]*\n[ \t]*'.join([re.escape(l) for l in lines2])
    if re.search(regex2, content, re.MULTILINE):
        print("Found target 2 with regex")
        content = re.sub(regex2, replacement2, content, flags=re.MULTILINE)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Finished")
